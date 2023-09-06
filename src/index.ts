import { Environment, LogJSON, Severity, TimeUnit } from './types';
import { ENV, N_LOGS } from './config';
import logger from './logger';
import path from 'path';
import { parseArgs } from './utils/cli';
import JSONLogFile from './models/files/JSONLogFile';
import TextLogFile from './models/files/TextLogFile';
import { formatTime } from './utils/time';
import TextToJSONLogsAdapter from './models/adapters/TextToJSONLogsAdapter';

const ROOT_DIR = path.join(__dirname, '..');

interface Args {
    inputFile: TextLogFile,
    outputFile: JSONLogFile,
}

const run = async (args: Args) => {
    const { inputFile, outputFile } = args;

    // Generate dummy app logs if necessary
    if (await inputFile.touch()) {
        await inputFile.generate(N_LOGS);
    }

    // Open array in JSON file
    const adapter = new TextToJSONLogsAdapter(({ level }: LogJSON) => level === Severity.Error)
    await adapter.execute(inputFile, outputFile);
}



// Function to execute when calling from CLI
const execute = async () => {
    const { input, output } = parseArgs();

    const now = new Date();
    logger.info(`Started log import/export at: ${now.toISOString()}`);

    await run({
        inputFile: new TextLogFile(path.join(ROOT_DIR, input)),
        outputFile: new JSONLogFile(path.join(ROOT_DIR, output)),
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