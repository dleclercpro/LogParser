import { NEW_LINE } from '../../constants';
import logger from '../../logger';
import { getRange } from '../../utils/array';
import { writeFile } from '../../utils/file';
import { generateAppLog } from '../../utils/logs';
import TimeDuration, { TimeUnit } from '../TimeDuration';
import PipeRead from '../pipes/PipeRead';
import LogFile from './LogFile';

class TextLogFile extends LogFile {

    public async generate(count: number): Promise<TimeDuration> {
        logger.info(`Generating ${count} random log entries in: ${this.path}`);

        const now = new Date();
        const logs = getRange(count).map(generateAppLog);

        await writeFile(this.path, logs.join(NEW_LINE) + NEW_LINE);

        const then = new Date();
        const duration =new TimeDuration(then.getTime() - now.getTime(), TimeUnit.Milliseconds);
        logger.info(`Generation of logs took: ${duration.format()}`);

        return duration;
    }

    public getPipeFrom() {
        return new PipeRead(this.path);
    }
}

export default TextLogFile;