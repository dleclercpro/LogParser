import logger from '../../logger';
import { getRange } from '../../utils/array';
import { writeFile } from '../../utils/file';
import { generateAppLog } from '../../utils/logs';
import PipeRead from '../streams/base/PipeRead';
import LogFile from './LogFile';

class TextLogFile extends LogFile {

    public async generate(count: number = 1000) {
        logger.info(`Generating ${count} random log entries in: ${this.path}`);

        const logs = getRange(count).map(generateAppLog);

        await writeFile(this.path, logs.join('\n') + '\n');
    }

    public getPipeFrom() {
        return new PipeRead(this.path);
    }
}

export default TextLogFile;