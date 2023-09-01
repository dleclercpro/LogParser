import pino from 'pino';
import pretty from 'pino-pretty';

const logger = pino({
    level: 'trace',
    transport: {
        target: 'pino-pretty',
    },
}, pretty({ colorize: true, colorizeObjects: true }));

export default logger;