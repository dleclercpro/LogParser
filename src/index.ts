import { Environment, Severity } from './types';
import { ENV, STRATEGIES } from './config';
import { parseArgs } from './utils/cli';



const execute = async () => {
    const { inputFile, outputFile, strategy, level } = parseArgs();

    if (strategy) {
        await strategy.run(inputFile, outputFile, level);

    } else {
        // No strategy picked: execute them all sequentially
        for (const strategy of STRATEGIES) {
            await strategy.run(inputFile, outputFile, level);
        }
    }
}



if ([Environment.Development].includes(ENV)) {
    execute();
}



export default execute;