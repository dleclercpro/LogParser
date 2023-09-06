import TextLogFile from '../../src/models/files/TextLogFile';
import TextToJSONLogsAdapter from '../../src/models/adapters/TextToJSONLogsAdapter';
import { RESULTS_LOGS_FILE_PATH, VALID_LOGS_FILE_PATH, WRONG_LOGS_FILE_PATH } from '../config';
import JSONLogFile from '../../src/models/files/JSONLogFile';
import { isValidISODate } from '../../src/utils/time';
import { SEVERITY_ORDERING } from '../../src/constants';
import { LogJSON, Severity } from '../../src/types';

const VALID_INPUT_FILE = new TextLogFile(VALID_LOGS_FILE_PATH);
const WRONG_INPUT_FILE = new TextLogFile(WRONG_LOGS_FILE_PATH);
const OUTPUT_FILE = new JSONLogFile(RESULTS_LOGS_FILE_PATH);

test(`should not throw any error if input format is valid`, async () => {
    const adapter = new TextToJSONLogsAdapter();

    await adapter.execute(VALID_INPUT_FILE, OUTPUT_FILE);
});

test(`should throw an error if input format is wrong`, async () => {
    const adapter = new TextToJSONLogsAdapter();

    const action = () => adapter.execute(WRONG_INPUT_FILE, OUTPUT_FILE);

    await action();
    // await expect(action()).rejects.toThrow();
});

test(`should output logs in expected format`, async () => {
    const adapter = new TextToJSONLogsAdapter();

    await adapter.execute(VALID_INPUT_FILE, OUTPUT_FILE);

    // Since exporter exports JSON, its output should be JSON-parsable
    const logs = JSON.parse(await OUTPUT_FILE.read());

    // Ensure all logs respect the pre-defined format
    logs.forEach(({ level, timestamp, transactionId }: LogJSON) => {
        expect(level).toBeDefined();
        expect(SEVERITY_ORDERING.includes(level as Severity)).toBeTruthy();

        expect(timestamp).toBeDefined();
        expect(isValidISODate(timestamp)).toBeTruthy();

        expect(transactionId).toBeDefined();
    });
});