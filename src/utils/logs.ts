import generate from 'random-words';
import { SEVERITY_ORDERING } from '../constants';
import { randomUUID } from 'crypto';
import { getRandom, getRange } from './array';
import { writeFile } from './file';

const generateAppLog = () => {
    const now = new Date();

    const message = generate(10).join(' ');
    const error = generate(10).join(' ');
    
    const infos = {
        transactionId: randomUUID(),
        details: message,
        code: 404,
        err: error,
    };

    return `${now.toISOString()} - ${getRandom(SEVERITY_ORDERING)} - ${JSON.stringify(infos)}`;
}

export const generateAppLogs = async (path: string, count: number = 100) => {
    const logs = getRange(count).map(generateAppLog);

    await writeFile(path, logs.join('\n') + '\n');
}