import fs, { WriteStream } from 'fs';
import { StreamOptions } from '../../../types';
import Pipe from './Pipe';

abstract class PipeWrite extends Pipe<WriteStream> {
    protected abstract onReady(): void;
    protected abstract onDrain(): void;
    protected abstract onFinish(): void;
    protected abstract onOpen(): void;
    protected abstract onClose(): void;
    protected abstract onError(error: Error): void;

    public createStream(filepath: string, options?: StreamOptions) {
        this.stream = fs.createWriteStream(filepath, options);

        this.stream.on('ready', () => this.onReady());
        this.stream.on('drain', () => this.onDrain());
        this.stream.on('finish', () => this.onFinish());
        this.stream.on('open', () => this.onOpen());
        this.stream.on('close', () => this.onClose());
        this.stream.on('error', (error: Error) => this.onError(error));

        return this.stream;
    }
}

export default PipeWrite;