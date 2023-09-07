import { SEVERITY_ORDERING } from '../../constants';
import { Severity } from '../../types';
import Log from './Log';

class LogHistory {
    protected logs: Log[];
    
    public constructor(logs: Log[]) {
        this.logs = logs;
    }

    public toString() {
        return this.logs
            .map(log => log.toString())
            .join('\n');
    }

    public toJSON() {
        return this.logs
            .map(log => log.toJSON());
    }

    public getLogs() {
        return this.logs;
    }

    public size() {
        return this.logs.length;
    }

    /**
     * Return a subset of the log history, with all logs' level being higher
     * or equal to the input one
     * @param level 
     * @returns 
     */
    public fromTo({ from, to }: { from: Severity, to?: Severity }) {
        const fromOrder = SEVERITY_ORDERING.indexOf(from);
        const toOrder = to ? SEVERITY_ORDERING.indexOf(to) : SEVERITY_ORDERING.length - 1;

        if (toOrder < fromOrder) {
            throw new Error(`'To' severity cannot be smaller than 'from' severity.`);
        }

        const logs = this.logs.filter(log => {
            const order = SEVERITY_ORDERING.indexOf(log.getLevel());

            return fromOrder <= order && order <= toOrder;
        });

        return new LogHistory(logs);
    }

    /**
     * Return series of logs of specified severity
     * @param severity 
     * @returns 
     */
    public of(severity: Severity) {
        return this.fromTo({ from: severity, to: severity });
    }
}

export default LogHistory;