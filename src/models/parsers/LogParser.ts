import Log from '../logs/Log';
import LogHistory from '../logs/LogHistory';
import Parser from './Parser';
import { Severity } from '../../types';
import { isValidISODate } from '../../utils/time';
import { SEVERITY_ORDERING } from '../../constants';
import logger from '../../logger';
import { LOCALE } from '../../config';

interface TextLineInfo {
    details: string,
    transactionId: string,
    code?: number,
    err?: string,
}

class LogParser extends Parser<LogHistory> {

    public parse(file: string) {
        const logs = file
            .split('\n')
            .map((line, i) => this.parseLine(line, i))
            .filter(Boolean);

        return new LogHistory(logs as Log[]);
    }

    protected parseLine(line: string, index: number, separator: string = ' - ') {
        const [timestamp, level, info] = line.split(separator);

        const errors = [];

        // Ensure timestamp is of ISO format
        if (!isValidISODate(timestamp)) {
            errors.push(`INVALID_DATE`);
        }

        // Ensure log level is valid
        if (!SEVERITY_ORDERING.includes(level as Severity)) {
            errors.push(`INVALID_LEVEL`);
        }

        // Ensure log infos are present
        if (!info) {
            errors.push(`MISSING_INFO`);
        }

        const { transactionId, details, err } = info ?
            JSON.parse(info) as TextLineInfo :
            { transactionId: '', details: '', err: '' };

        // Ensure transaction ID is present
        if (!transactionId) {
            errors.push(`MISSING_TRANSACTION_ID`);
        }

        // Ensure log message is present
        if (!details) {
            errors.push(`MISSING_DETAILS`);
        }

        if (errors.length > 0) {
            logger.warn(`Line ${(index + 1).toLocaleString(LOCALE)} is invalid [${errors.join(' | ')}]`);
            return;
        }
        
        return new Log({
            level: level as Severity,
            message: details,
            time: new Date(timestamp),
            transaction: transactionId,
            error: err ? new Error(err) : undefined,
        });
    }
}

export default LogParser;