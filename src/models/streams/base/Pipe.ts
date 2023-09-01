import Stream from 'stream';
import { StreamOptions } from '../../../types';

abstract class Pipe<S extends Stream> {
    protected stream?: S;

    public abstract create(filepath: string, options: StreamOptions): void;
}

export default Pipe;