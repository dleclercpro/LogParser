import Stream from 'stream';
import { StreamOptions } from '../../types';

abstract class Pipe<S extends Stream> {
    protected filepath: string;
    protected stream?: S;

    protected abstract createStream(options?: StreamOptions): void;

    public constructor(filepath: string) {
        this.filepath = filepath;
    }

    public getStream(options?: StreamOptions) {
        if (!this.stream) {
            this.createStream(options);
        }

        return this.stream!;
    }
}

export default Pipe;