import { NEW_LINE } from '../../constants';
import logger from '../../logger';
import { getRange } from '../../utils/array';
import { writeFile } from '../../utils/file';
import { generateAppLog } from '../../utils/logs';
import PipeRead from '../pipes/PipeRead';
import LogFile from './LogFile';

class TextLogFile extends LogFile {

    public async generate(count: number) {
        logger.info(`Generating ${count} random log entries in: ${this.path}`);

        const logs = getRange(count).map(generateAppLog);

        await writeFile(this.path, logs.join(NEW_LINE) + NEW_LINE);
    }

    public getPipeFrom() {
        return new PipeRead(this.path);
    }
}

export default TextLogFile;