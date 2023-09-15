import { NO_TIME_DURATION } from '../../constants';
import logger from '../../logger';
import { Severity } from '../../types';
import TimeDuration, { TimeUnit } from '../TimeDuration';
import JSONLogFile from '../files/JSONLogFile';
import TextLogFile from '../files/TextLogFile';
import {capitalizeFirstCharacter } from '../../utils/string';

export enum StrategyName {
    Streams = 'streams',
    Memory = 'memory',
}

abstract class Strategy {
    protected abstract label: string;

    protected inputFile?: TextLogFile;
    protected outputFile?: JSONLogFile;

    protected startTime?: Date;
    protected endTime?: Date;
    protected duration: TimeDuration;

    public constructor() {
        this.duration = NO_TIME_DURATION;
    }
    
    public abstract run(inputFile: TextLogFile, outputFile: JSONLogFile, severity?: Severity): Promise<TimeDuration>;

    protected async start() {
        const name = capitalizeFirstCharacter(this.label);

        logger.info(`--------------- Strategy: ${name} [START] ---------------`);

        if (!this.inputFile) throw new Error('Missing input file!');
        if (!this.outputFile) throw new Error('Missing output file!');

        // Give info about strategy
        this.startTime = new Date();
        logger.info(`Started log import/export using '${name}' strategy at: ${this.startTime.toISOString()}`);
    
        // Give info about I/O files
        logger.info(`Reading logs from: '${this.inputFile.getPath()}'`);
        logger.info(`Writing logs to: '${this.outputFile.getPath()}'`);
    }

    protected async end() {
        this.endTime = new Date();
        this.duration = new TimeDuration(this.endTime!.getTime() - this.startTime!.getTime(), TimeUnit.Milliseconds);
        
        const name = capitalizeFirstCharacter(this.label);

        logger.info(`Strategy took: ${this.duration.format()}`);
        logger.info(`--------------- Strategy: ${name} [END] ---------------`);
    }

    public getName() {
        return this.label;
    }
}

export default Strategy;