import minimist from 'minimist';
import MemoryStrategy from '../models/strategies/MemoryStrategy';
import { Strategies } from '../models/strategies/Strategy';
import StreamsStrategy from '../models/strategies/StreamsStrategy';
import path from 'path';
import JSONLogFile from '../models/files/JSONLogFile';
import TextLogFile from '../models/files/TextLogFile';

const ROOT_DIR = path.join(__dirname, '../..');

export const parseArgs = () => {
    const { input, output, strategy: s } = minimist(process.argv.slice(2));

    if (!input) {
        throw new Error(`No path to input log file provided!`);
    }

    if (!output) {
        throw new Error(`No path to output log file provided!`);
    }

    const inputFile = new TextLogFile(path.join(ROOT_DIR, input));
    const outputFile = new JSONLogFile(path.join(ROOT_DIR, output));

    let strategy;
    
    if (s) {
        switch (s) {
            case Strategies.Streams:
                strategy = new StreamsStrategy();
                break;
            case Strategies.Memory:
                strategy = new MemoryStrategy();
                break;
            default:
                throw new Error('Invalid strategy.');
        }
    }

    return {
        inputFile,
        outputFile,
        strategy,
    };
}