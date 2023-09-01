import fs, { ReadStream } from 'fs';
import { StreamOptions } from '../../../types';
import Pipe from './Pipe';

abstract class PipeRead extends Pipe<ReadStream> {
    protected abstract onReady(): void;
    protected abstract onResume(): void;
    protected abstract onEnd(): void;
    protected abstract onPause(): void;
    protected abstract onOpen(): void;
    protected abstract onClose(): void;
    protected abstract onError(error: Error): void;

    public create(filepath: string, options?: StreamOptions) {
        this.stream = fs.createReadStream(filepath, options);

        this.stream.on('ready', () => this.onReady());
        this.stream.on('resume', () => this.onResume());
        this.stream.on('end', () => this.onEnd());
        this.stream.on('pause', () => this.onPause());
        this.stream.on('open', () => this.onOpen());
        this.stream.on('close', () => this.onClose());
        this.stream.on('error', (error: Error) => this.onError(error));

        return this.stream;
    }
}

export default PipeRead;