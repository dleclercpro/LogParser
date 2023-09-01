import LogImporter from '../src/models/importers/LogImporter'
import LogParser from '../src/models/parsers/LogParser';
import { TEST_FILEPATH } from './config';

export const loadTestLogHistory = async () => {
    const importer = new LogImporter();
    const file = await importer.import(TEST_FILEPATH);

    const parser = new LogParser();
    const history = parser.parse(file);

    return history;
}