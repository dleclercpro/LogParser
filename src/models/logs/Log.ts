import { Severity } from '../../types';

interface Args {
    level: Severity,
    message: string,
    time: Date,
    transaction: string,
    error?: Error,
}

class Log {
    protected level: Severity;
    protected message: string;
    protected time: Date;
    protected transaction: string;
    protected error?: Error;

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

            log = `${log} [${error.message}]`;
        }

        return log;
    }

    public toJSON() {
        return {
            timestamp: this.getEpochTime(),
            level: this.level,
            transactionId: this.transaction,
            err: this.error?.message,
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