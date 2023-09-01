import logger from '../../logger';
import PipeRead from './base/PipeRead';

class FromTextLogs extends PipeRead {

    protected onReady() {
        logger.debug('The reading stream is ready.');
    }

    protected onResume() {
        logger.debug(`Reading data from stream was resumed.`);
    }

    protected onEnd() {
        logger.debug(`No more data to be read from stream.`);
    }

    protected onPause() {
        logger.debug(`The reading stream was paused.`);
    }

    protected onOpen() {
        logger.debug('The reading stream was opened.');
    }

    protected onClose() {
        logger.debug(`The reading stream was closed.`);
    }

    protected onError(err: Error) {
        logger.error(`Reading stream encountered an error: ${err.message}`);

        throw err;
    }
}

export default FromTextLogs;