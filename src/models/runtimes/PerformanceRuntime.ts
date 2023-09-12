import path from 'path';
import { LOCALE, N_LOGS_RUNTIME_PERFORMANCE_COMPARISON, ROOT_DIR, STRATEGIES } from '../../config';
import { Severity } from '../../types';
import TimeDuration from '../TimeDuration';
import JSONLogFile from '../files/JSONLogFile';
import TextLogFile from '../files/TextLogFile';
import Runtime, { Args, RuntimeName, ValidArgs } from './Runtime';
import logger from '../../logger';
import { StrategyName } from '../strategies/Strategy';
import PerformanceGraph from '../PerformanceGraph';



interface Performance {
    size: number,
    durations: {
        [strategy: string]: TimeDuration,
    },
}

const VALID_ARGS: ValidArgs = {
    level: {
        isRequired: true,
        validate: () => true,
    },
};



// Singleton
class PerformanceRuntime extends Runtime {
    private static instance: PerformanceRuntime;

    protected name: RuntimeName = RuntimeName.Performance;
    protected validArgs: ValidArgs = VALID_ARGS;

    private constructor() {
        super();
    }

    protected async doExecute(args: Args) {
        const { level } = this.getContext(args);

        const results: Performance[] = [];
        
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

        await this.generatePerformanceGraph(results);
    }

    public static getInstance() {
        if (!this.instance) {
            this.instance = new PerformanceRuntime();
        }

        return this.instance;
    }

    private getContext(args: { [arg: string]: string }) {
        const { level } = args;

        return {
            level: level as Severity,
        };
    }

    private async generatePerformanceGraph(results: Performance[]) {
        logger.info(`Generating performance graph for all strategies...`);

        const graph = new PerformanceGraph(`${ROOT_DIR}/data/performance-comparison.png`);

        const title = 'Strategy Performance based on Number of Logs to Process';
        const xAxisLabel = 'Number of Logs (-)';
        const yAxisLabel = 'Duration (ms)';

        const data = [{
            label: StrategyName.Memory,
            data: results.map(d => ({ x: d.size, y: d.durations[StrategyName.Memory].toMs().getAmount() })),
            color: 'orange',
        }, {
            label: StrategyName.Streams,
            data: results.map(d => ({ x: d.size, y: d.durations[StrategyName.Streams].toMs().getAmount() })),
            color: 'purple',
        }];

        await graph.generate(data, { title, xAxisLabel, yAxisLabel });
    }
}

export default PerformanceRuntime.getInstance();