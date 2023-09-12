import { N_LOGS } from '../../config';
import { NO_TIME_DURATION } from '../../constants';
import logger from '../../logger';
import { Severity } from '../../types';
import TimeDuration, { TimeUnit } from '../TimeDuration';
import JSONLogFile from '../files/JSONLogFile';
import TextLogFile from '../files/TextLogFile';

export enum StrategyName {
    Streams = 'streams',
    Memory = 'memory',
}

abstract class Strategy {
    protected abstract name: string;

    protected inputFile?: TextLogFile;
    protected outputFile?: JSONLogFile;

    protected startTime?: Date;
    protected endTime?: Date;

    protected durations: {
        generation: TimeDuration,
        total: TimeDuration,
    }

    public constructor() {
        this.durations = { generation: NO_TIME_DURATION, total: NO_TIME_DURATION };
    }
    
    public abstract run(inputFile: TextLogFile, outputFile: JSONLogFile, severity?: Severity): Promise<TimeDuration>;

    protected async start() {
        logger.info(`--------------- Strategy: ${this.name} [START] ---------------`);

        if (!this.inputFile) throw new Error('Missing input file!');
        if (!this.outputFile) throw new Error('Missing output file!');

        // Give info about strategy
        this.startTime = new Date();
        logger.info(`Started log import/export using '${this.name}' strategy at: ${this.startTime.toISOString()}`);
    
        // Give info about I/O files
        logger.info(`Reading logs from: '${this.inputFile.getPath()}'`);
        logger.info(`Writing logs to: '${this.outputFile.getPath()}'`);

        // Generate dummy app logs if necessary
        if (await this.inputFile.touch()) {
            this.durations.generation = await this.inputFile.generate(N_LOGS);
        }
    }

    protected async end() {
        this.endTime = new Date();
        this.durations.total = new TimeDuration(this.endTime!.getTime() - this.startTime!.getTime(), TimeUnit.Milliseconds);
        
        // In case input log file needed to be generated, subtract the required time
        if (!this.durations.generation.isZero()) {
            this.durations.total = this.durations.total.subtract(this.durations.generation);
        }
        
        logger.info(`Strategy took: ${this.durations.total.format()}`);
        logger.info(`--------------- Strategy: ${this.name} [END] ---------------`);
    }

    public getName() {
        return this.name;
    }
}

export default Strategy;