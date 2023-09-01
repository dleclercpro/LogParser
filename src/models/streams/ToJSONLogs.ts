import logger from '../../logger';
import PipeWrite from './base/PipeWrite';

class ToJSONLogs extends PipeWrite {

    protected onReady() {
        logger.debug('The writing stream is ready.');
    }

    protected onFinish() {
        logger.debug(`The writing stream is finished.`);
    }

    protected onDrain() {
        logger.debug(`The writing stream was drained: ${this.stream?.writableFinished}.`);
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
}

export default ToJSONLogs;