import LogImporter from '../../src/models/importers/LogImporter';
import LogParser from '../../src/models/parsers/LogParser';
import { TEST_FILEPATH, TEST_FILE_SIZE, WRONG_INPUT_FILEPATH } from '../config';

test(`Log parser should parse correct number of log entries`, async () => {
    const importer = new LogImporter();
    const file = await importer.import(TEST_FILEPATH);

    const parser = new LogParser();
    const history = parser.parse(file);

    expect(history.size()).toEqual(TEST_FILE_SIZE);
});

test(`Log parser should throw an error if input format is incorrect`, async () => {
    const importer = new LogImporter();
    const file = await importer.import(WRONG_INPUT_FILEPATH);

    const parser = new LogParser();
    const action = () => parser.parse(file);

    expect(action).toThrow();
});