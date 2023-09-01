import { Severity } from '../types';
import GeneralError from './errors/GeneralError';
import Transaction from './Transaction';

interface Args {
    level: Severity,
    message: string,
    time: Date,
    transaction: Transaction,
    error?: GeneralError,
}

class Log {
    protected level: Severity;
    protected message: string;
    protected time: Date;
    protected transaction: Transaction;
    protected error?: GeneralError;

    public constructor(args: Args) {
        const { level, message, time, transaction, error } = args;

        this.level = level;
        this.message = message;
        this.time = time;
        this.transaction = transaction;
        this.error = error;
    }

    public toString() {
        let log = `${this.time.toISOString()} - ${this.level.toUpperCase()} - ${this.message}`;

        if (this.hasError()) {
            const error = this.error!;

            log = `${log} [${error.getCode()}: ${error.getMessage()}]`;
        }

        return log;
    }

    public toJSON() {
        return {
            timestamp: this.getEpochTime(),
            loglevel: this.level,
            transactionId: this.transaction.getId(),
            err: this.error?.getMessage(),
        };
    }

    public getLevel() {
        return this.level;
    }

    public getMessage() {
        return this.message;
    }

    public getTime() {
        return this.time;
    }

    public getEpochTime() {
        return this.time.getTime();
    }

    public getTransaction() {
        return this.transaction;
    }

    public getError() {
        return this.error;
    }

    public hasError() {
        return !!this.error;
    }
}

export default Log;