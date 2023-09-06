import { Environment, LogJSON, Severity } from './types';
import { ENV, N_LOGS } from './config';
import logger from './logger';
import path from 'path';
import { parseArgs } from './utils/cli';
import JSONLogFile from './models/files/JSONLogFile';
import TextLogFile from './models/files/TextLogFile';
import TextToJSONLogsAdapter from './models/adapters/TextToJSONLogsAdapter';
import TimeDuration, { TimeUnit } from './models/TimeDuration';

const ROOT_DIR = path.join(__dirname, '..');

interface Args {
    inputFile: TextLogFile,
    outputFile: JSONLogFile,
}

const run = async (args: Args) => {
    const { inputFile, outputFile } = args;

    // Generate dummy app logs if necessary
    let generationTime = new TimeDuration(0, TimeUnit.Milliseconds);
    if (await inputFile.touch()) {
        generationTime = await inputFile.generate(N_LOGS);
    }

    const adapter = new TextToJSONLogsAdapter(({ level }: LogJSON) => level === Severity.Error);
    await adapter.execute(inputFile, outputFile);

    return generationTime;
}



// Function to execute when calling from CLI
const execute = async () => {
    const { input, output } = parseArgs();

    const now = new Date();
    logger.info(`Started log import/export at: ${now.toISOString()}`);

    const generationTime = await run({
        inputFile: new TextLogFile(path.join(ROOT_DIR, input)),
        outputFile: new JSONLogFile(path.join(ROOT_DIR, output)),
    });

    const then = new Date();
    const duration = new TimeDuration(then.getTime() - now.getTime(), TimeUnit.Milliseconds).subtract(generationTime);
    logger.info(`Parsing of logs took: ${duration.format()}`);
}

if ([Environment.Development].includes(ENV)) {
    execute();
}

export default execute;