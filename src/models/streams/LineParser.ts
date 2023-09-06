import { Transform, TransformCallback } from 'stream';
import { isValidISODate } from '../../utils/time';
import { NEW_LINE, NEW_LINE_REGEXP, SEVERITY_ORDERING } from '../../constants';
import { LogFilter, LogJSON, Severity } from '../../types';
import logger from '../../logger';

const SEPARATOR = ' - ';
const TAB_SIZE = 2;

type Args = { filter?: LogFilter };

/**
 * This transform pipe is responsible for validating, parsing, and
 * formatting a received complete log line. It can also filter raw lines,
 * based on an input filter at construction.
 */
class LineParser extends Transform {
    private customFilter: LogFilter;

    public constructor({ filter }: Args) {
        super();

        this.customFilter = filter ? filter : () => true;
    }

    public _transform = (chunk: Buffer, encoding: BufferEncoding, done: TransformCallback) => {
        try {
            const lines = chunk.toString().split(NEW_LINE_REGEXP);

            const logs = lines
                .filter(line => this.validateLine(line))
                .map(line => this.parseLine(line))
                .filter(log => this.customFilter(log))
                .map(log => this.padLines(log))
                .map(log => `${log},`)
                .join(NEW_LINE);

            done(null, `${logs}\n`);
        
        } catch (err: any) {
            done(err);
        }
    }

    private validateLine(line: string) {
        const [ timestamp, level, info ] = line.split(SEPARATOR);

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
        try {
            const { transactionId, details } = JSON.parse(info);

            // Ensure transaction ID is present
            if (!transactionId) {
                errors.push(`MISSING_TRANSACTION_ID`);
            }

            // Ensure log message is present
            if (!details) {
                errors.push(`MISSING_DETAILS`);
            }
        
        } catch (err) {
            errors.push(`MISSING_INFO`);
        }

        // Errors found: print them out
        if (errors.length > 0) {
            logger.error(`Could not parse line: '${line}'`);

            return false;
        }

        return true;
    }

    private parseLine(line: string) {
        const [ timestamp, level, info ] = line.split(SEPARATOR);

        const { transactionId, err } = JSON.parse(info);

        return {
            level,
            timestamp,
            transactionId,
            err,
        };
    }

    private padLines(log: LogJSON, factor: number = 1) {
        return JSON.stringify(log, undefined, TAB_SIZE)
                .split(NEW_LINE_REGEXP)
                .map(log => log.padStart(log.length + factor * TAB_SIZE, ' '))
                .join(NEW_LINE)
    }
}

export default LineParser;