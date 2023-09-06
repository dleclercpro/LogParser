import { appendToFile, truncateFile } from '../../utils/file';
import PipeWrite from '../pipes/PipeWrite';
import LogFile from './LogFile';

class JSONLogFile extends LogFile {

    public async start() {
        await appendToFile(this.path, '[\n');
    }

    public async end() {
        await truncateFile(this.path, 2);
        await appendToFile(this.path, '\n]');
    }

    public getPipeTo() {
        return new PipeWrite(this.path);
    }
}

export default JSONLogFile;