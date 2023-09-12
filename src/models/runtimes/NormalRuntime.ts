import path from 'path';
import { N_LOGS_RUNTIME_NORMAL, ROOT_DIR, STRATEGIES } from '../../config';
import { SEVERITY_ORDERING } from '../../constants';
import logger from '../../logger';
import { Severity } from '../../types';
import JSONLogFile from '../files/JSONLogFile';
import TextLogFile from '../files/TextLogFile';
import { StrategyName } from '../strategies/Strategy';
import Runtime, { Args, RuntimeName, ValidArgs } from './Runtime';



const VALID_ARGS_SET: ValidArgs = {
    input: {
        isRequired: true,
        validate: (value) => {
            if (!value) {
                logger.fatal(`No path to input log file provided!`);
                return false;
            }
            return true;
        },
    },
    output: {
        isRequired: true,
        validate: (value) => {
            if (!value) {
                logger.fatal(`No path to output log file provided!`);
                return false;
            }
            return true;
        },
    },
    level: {
        isRequired: true,
        validate: (value) => {
            if (!value) {
                logger.fatal(`No log level provided!`);
                return false;
            }
            if (!SEVERITY_ORDERING.includes(value as Severity)) {
                logger.fatal(`Invalid log level provided!`);
                return false;
            }
            return true;
        },
    },
    strategy: {
        isRequired: false,
        validate: (value) => {
            switch (value) {
                case StrategyName.Streams:
                case StrategyName.Memory:
                    return true;
                default:
                    logger.fatal('Invalid strategy.');
                    return false;
            }
        },
    },
};



// Singleton
class NormalRuntime extends Runtime {
    private static instance: NormalRuntime;

    protected name: RuntimeName = RuntimeName.Normal;
    protected validArgs: ValidArgs = VALID_ARGS_SET;

    private constructor() {
        super();
    }

    protected async doExecute(args: Args) {
        const { inputFile, outputFile, level, strategy } = this.getContext(args);

        // Generate dummy app logs if necessary
        if (await inputFile.touch()) {
            await inputFile.generate(N_LOGS_RUNTIME_NORMAL);
        }

        if (strategy) {
            await strategy.run(inputFile, outputFile, level as Severity);
            return;
        }
        
        // No strategy picked: execute them all sequentially
        for (const strategy of Object.values(STRATEGIES)) {
            await strategy.run(inputFile, outputFile, level as Severity);
        }
    }

    public static getInstance() {
        if (!this.instance) {
            this.instance = new NormalRuntime();
        }

        return this.instance;
    }

    private getContext(args: { [arg: string]: string }) {
        const { input, output, level, strategy } = args;

        return {
            inputFile: new TextLogFile(path.join(ROOT_DIR, input)),
            outputFile: new JSONLogFile(path.join(ROOT_DIR, output)),
            level: level as Severity,
            strategy: strategy ? STRATEGIES[strategy as StrategyName] : undefined,
        };
    }
}

export default NormalRuntime.getInstance();