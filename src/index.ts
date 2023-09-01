import minimist from 'minimist';
import { Environment, LogJSON, Severity } from './types';
import { ENV } from './config';
import FromTextLogs from './models/streams/FromTextLogs';
import ToJSONLogs from './models/streams/ToJSONLogs';
import Log from './models/Log';
import LineExtractor from './models/streams/LineExtractor';
import LineParser from './models/streams/LineParser';
import { pipeline } from 'stream/promises';
import { Transform } from 'stream';
import PipeRead from './models/streams/base/PipeRead';
import PipeWrite from './models/streams/base/PipeWrite';
import { deleteFile, truncateFile, appendToFile } from './utils/file';
import logger from './logger';
import { generateAppLogs } from './utils/logs';

interface IOArgs {
    input: string,
    output: string,
}

const parseArgs = (): IOArgs => {
    const { input, output } = minimist(process.argv.slice(2));

    if (!input) {
        throw new Error(`No path to input log file provided!`);
    }

    if (!output) {
        throw new Error(`No path to output log file provided!`);
    }

    return {
        input,
        output,
    };
}



interface Args<E, D> {
    inputPipe: PipeRead,
    outputPipe: PipeWrite,
    transforms: Transform[],
    filepaths: IOArgs,
}

const run = async (args: Args<Event, Log>) => {
    const { inputPipe, outputPipe, transforms, filepaths } = args;
    const { input, output } = filepaths;

    const now = new Date();
    logger.info(`Started log import/export at: ${now.toISOString()}`);

    logger.info(`Generating ${1000} random log entries in: ${input}`);
    await generateAppLogs(input , 1000);

    logger.info(`Looking for log entries in: '${input}'`);
    logger.info(`Parsing and writing log entries to: '${output}'`);

    // Delete existing file
    await deleteFile(output);

    // Open array in JSON file
    await appendToFile(output, '[\n');

    // Write filtered parsed logs into JSON file
    await pipeline([
        inputPipe.create(input),
        ...transforms,
        outputPipe.create(output, { flags: 'a' }),
    ]);

    // Remove last comma, and close array in JSON file
    await truncateFile(output, 2);
    await appendToFile(output, '\n]');

    logger.info('Done!');
}



// Function to execute when calling from CLI
const levelFilter = ({ loglevel }: LogJSON) => loglevel === Severity.Error;

const execute = () => run({
    inputPipe: new FromTextLogs(),
    outputPipe: new ToJSONLogs(),
    transforms: [new LineExtractor(), new LineParser({ filter: levelFilter })],
    filepaths: parseArgs(),
});

if ([Environment.Development].includes(ENV)) {
    execute();
}

export default execute;