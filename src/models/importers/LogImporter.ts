import LogFile from '../files/LogFile';
import Importer from './Importer';

class LogImporter extends Importer {

    public async import(file: LogFile) {
        const data = await file.read({ encoding: 'utf-8' });

        return data;
    }
}

export default LogImporter;