import fs, { ReadStream } from 'fs';
import { StreamOptions } from '../../types';
import Pipe from './Pipe';
import logger from '../../logger';

class PipeRead extends Pipe<ReadStream> {

    protected onReady() {
        logger.trace('The reading stream is ready.');
    }

    protected onResume() {
        logger.trace(`Reading data from stream was resumed.`);
    }

    protected onEnd() {
        logger.trace(`No more data to be read from stream.`);
    }

    protected onPause() {
        logger.trace(`The reading stream was paused.`);
    }

    protected onOpen() {
        logger.trace('The reading stream was opened.');
    }

    protected onClose() {
        logger.trace(`The reading stream was closed.`);
    }

    protected onError(err: Error) {
        logger.error(`Reading stream encountered an error: ${err.message}`);

        throw err;
    }

    public createStream(options?: StreamOptions) {
        this.stream = fs.createReadStream(this.filepath, options);

        this.stream.on('ready', () => this.onReady());
        this.stream.on('resume', () => this.onResume());
        this.stream.on('end', () => this.onEnd());
        this.stream.on('pause', () => this.onPause());
        this.stream.on('open', () => this.onOpen());
        this.stream.on('close', () => this.onClose());
        this.stream.on('error', (error: Error) => this.onError(error));
    }
}

export default PipeRead;