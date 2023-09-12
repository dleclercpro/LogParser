import path from 'path';
import { LOCALE, N_LOGS_RUNTIME_PERFORMANCE_COMPARISON, ROOT_DIR, STRATEGIES } from '../../config';
import { Severity } from '../../types';
import TimeDuration from '../TimeDuration';
import JSONLogFile from '../files/JSONLogFile';
import TextLogFile from '../files/TextLogFile';
import Runtime, { Args, RuntimeName, ValidArgs } from './Runtime';
import logger from '../../logger';



interface PerformanceComparison {
    size: number,
    durations: {
        [strategy: string]: TimeDuration,
    },
}

const VALID_ARGS_SET: ValidArgs = {
    level: {
        isRequired: true,
        validate: () => true,
    },
};



// Singleton
class PerformanceComparisonRuntime extends Runtime {
    private static instance: PerformanceComparisonRuntime;

    protected name: RuntimeName = RuntimeName.PerformanceComparison;
    protected validArgs: ValidArgs = VALID_ARGS_SET;

    private constructor() {
        super();
    }

    protected async doExecute(args: Args) {
        const { level } = this.getContext(args);

        const results: PerformanceComparison[] = [];
        
        for (const size of N_LOGS_RUNTIME_PERFORMANCE_COMPARISON) {
            const inputFile = new TextLogFile(path.join(ROOT_DIR, 'data', `${size.toLocaleString(LOCALE)}.log`));
            const outputFile = new JSONLogFile(path.join(ROOT_DIR, 'data', `${size.toLocaleString(LOCALE)}.json`));
        
            // Generate dummy app logs if necessary
            if (await inputFile.touch()) {
                await inputFile.generate(size);
            }

            // Create new results entry
            results.push({ size, durations: {} });
    
            for (const strategy of Object.values(STRATEGIES)) {
                results[results.length - 1].durations[strategy.getName()] = await strategy.run(inputFile, outputFile, level);
            }
        }
    
        logger.info(results);
    }

    public static getInstance() {
        if (!this.instance) {
            this.instance = new PerformanceComparisonRuntime();
        }

        return this.instance;
    }

    private getContext(args: { [arg: string]: string }) {
        const { level } = args;

        return {
            level: level as Severity,
        };
    }
}

export default PerformanceComparisonRuntime.getInstance();