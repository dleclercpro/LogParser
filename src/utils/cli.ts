import minimist from 'minimist';

export interface IOArgs {
    input: string,
    output: string,
}

export const parseArgs = (): IOArgs => {
    const { input, output } = minimist(process.argv.slice(2));

    if (!input) {
        throw new Error(`No path to input log file provided!`);
    }

    if (!output) {
        throw new Error(`No path to output log file provided!`);
    }

    return {
        input,
        output,
    };
}