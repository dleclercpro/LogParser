import { Transform, TransformCallback } from 'stream';
import logger from '../../logger';
import { getLast, sum } from '../../utils/array';

/**
 * This transform pipe is responsible for buffering lines:
 * only complete lines are passed down to the next pipe.
 */
class LineExtractor extends Transform {
    protected counts: { bytes: number, lines: number };
    protected buffer: string;

    public constructor() {
        super();
        
        this.counts = { bytes: 0, lines: 0 };
        this.buffer = '';
    }

    public _transform = (chunk: Buffer, encoding: BufferEncoding, done: TransformCallback) => {
        const data = chunk.toString();
        const input = this.buffer ? this.buffer + data : data;
        const rawLines = input.split('\n');

        // Store last bytes of data, in case last line is incomplete
        this.buffer = getLast(rawLines);

        // Keep complete lines only
        let lines: string[] = [];

        if (rawLines.length > 1) {
            lines = rawLines.slice(0, -1);

            this.updateCounters(lines);
        }

        done(null, lines.join('\n'));
    }

    public _final(done: (error?: Error | null) => void): void {

        // In case buffer was not emptied on last pass: drain it
        if (this.buffer) {
            this.push(this.buffer);
        }

        done(null);
    }

    private updateCounters(lines: string[]) {
        this.counts.lines += lines.length;
        this.counts.bytes += sum(lines.map(line => line.length));

        logger.trace(`# lines read: ${this.counts.lines}`);
        logger.trace(`# bytes read: ${this.counts.bytes}`);
    }
}

export default LineExtractor;