import { Environment, LogJSON, Severity, TimeUnit } from './types';
import { ENV, N_LOGS } from './config';
import LineExtractor from './models/streams/LineExtractor';
import LineParser from './models/streams/LineParser';
import { pipeline } from 'stream/promises';
import { Transform } from 'stream';
import logger from './logger';
import path from 'path';
import { parseArgs } from './utils/cli';
import JSONLogFile from './models/files/JSONLogFile';
import TextLogFile from './models/files/TextLogFile';
import { formatTime } from './utils/time';

const ROOT_DIR = path.join(__dirname, '..');

interface Args {
    inputFile: TextLogFile,
    outputFile: JSONLogFile,
    transforms: Transform[],
}

const run = async (args: Args) => {
    const { inputFile, outputFile, transforms } = args;

    logger.info(`Reading logs from: '${inputFile.getPath()}'`);
    logger.info(`Writing logs to: '${outputFile.getPath()}'`);

    // Generate dummy app logs if necessary
    if (await inputFile.touch()) {
        await inputFile.generate(N_LOGS);
    }

    // Delete existing and create new file
    await outputFile.delete();
    await outputFile.create();

    // Open array in JSON file
    await outputFile.start();

    // Write filtered parsed logs into JSON file
    await pipeline([
        inputFile.getPipeFrom().getStream(),
        ...transforms,
        outputFile.getPipeTo().getStream({ flags: 'a' }),
    ]);

    // Remove last comma, and close array in JSON file
    await outputFile.end();
}



// Function to execute when calling from CLI
const execute = async () => {
    const { input, output } = parseArgs();

    const now = new Date();
    logger.info(`Started log import/export at: ${now.toISOString()}`);

    await run({
        inputFile: new TextLogFile(path.join(ROOT_DIR, input)),
        outputFile: new JSONLogFile(path.join(ROOT_DIR, output)),
        transforms: [new LineExtractor(), new LineParser({
            filter: ({ loglevel }: LogJSON) => loglevel === Severity.Error,
        })],
    });

    const then = new Date();
    logger.info('Done!');
    
    const duration = then.getTime() - now.getTime(); // ms
    logger.info(`Parsing of logs took: ${formatTime({ time: duration, unit: TimeUnit.Milliseconds })}`)
}

if ([Environment.Development].includes(ENV)) {
    execute();
}

export default execute;