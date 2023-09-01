import { Transform, TransformCallback } from 'stream';
import logger from '../../logger';

class LineExtractor extends Transform {
    protected counts: { bytes: number, lines: number };
    protected prevData?: string;

    public constructor() {
        super();
        
        this.counts = { bytes: 0, lines: 0 };
    }

    public _transform = (chunk: Buffer, encoding: BufferEncoding, done: TransformCallback) => {
        const data = chunk.toString();
        const isLastData = data.length < this.readableHighWaterMark;
        const input = this.prevData ? this.prevData + data : data;
        const rawLines = input.split('\n');

        // Store last bytes of data, in case line is incomplete
        this.prevData = !isLastData ? rawLines[rawLines.length - 1] : '';

        // Keep complete lines only
        const lines = !isLastData ? rawLines.slice(0, -1) : rawLines;

        this.counts.lines += lines.length;
        this.counts.bytes += chunk.length;

        logger.trace(`# lines read: ${this.counts.lines}`);
        logger.trace(`# bytes read: ${this.counts.bytes}`);

        done(null, lines.join('\n'));
    }
}

export default LineExtractor;