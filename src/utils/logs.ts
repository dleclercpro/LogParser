import generate from 'random-words';
import { SEVERITY_ORDERING } from '../constants';
import { randomUUID } from 'crypto';
import { getRandom } from './array';

const N_POSSIBLE_ERRORS = 500;
const MESSAGE_SIZE = 10;
const ERROR_SIZE = 10;

export const generateAppLog = () => {
    const now = new Date();

    const message = generate(MESSAGE_SIZE).join(' ');
    const error = generate(ERROR_SIZE).join(' ');
    
    const infos = {
        transactionId: randomUUID(),
        details: message,
        code: Math.ceil(Math.random() * N_POSSIBLE_ERRORS),
        err: error,
    };

    return `${now.toISOString()} - ${getRandom(SEVERITY_ORDERING)} - ${JSON.stringify(infos)}`;
}