import fs, { WriteStream } from 'fs';
import { StreamOptions } from '../../types';
import Pipe from './Pipe';
import logger from '../../logger';

class PipeWrite extends Pipe<WriteStream> {

    protected onReady() {
        logger.debug('The writing stream is ready.');
    }

    protected onFinish() {
        logger.debug(`The writing stream is finished.`);
    }

    protected onDrain() {
        logger.debug(`The writing stream was drained.`);
    }

    protected onOpen() {
        logger.debug(`The writing stream was opened.`);
    }

    protected onClose() {
        logger.debug(`The writing stream was closed.`);
    }

    protected onError(err: Error) {
        logger.error(`The writing stream encountered an error: ${err.message}`);

        throw err;
    }

    protected createStream(options?: StreamOptions) {
        this.stream = fs.createWriteStream(this.filepath, options);

        this.stream.on('ready', () => this.onReady());
        this.stream.on('drain', () => this.onDrain());
        this.stream.on('finish', () => this.onFinish());
        this.stream.on('open', () => this.onOpen());
        this.stream.on('close', () => this.onClose());
        this.stream.on('error', (error: Error) => this.onError(error));
    }
}

export default PipeWrite;