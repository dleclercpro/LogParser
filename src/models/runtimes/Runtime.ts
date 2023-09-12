import logger from '../../logger';

export enum RuntimeName {
    Normal = 'Normal',
    PerformanceComparison = 'PerformanceComparison',
}

export interface Args {
    [argName: string]: string,
}

export interface ValidArgs {
    [argName: string]: {
        isRequired: boolean,
        validate: (value: string) => boolean,
    },
}

abstract class Runtime {
    protected abstract name: RuntimeName;
    protected abstract validArgs: ValidArgs;

    protected abstract doExecute(args: Args): Promise<void>;

    public async execute(args: Args) {
        logger.info(`Executing runtime: ${this.name}`);

        await this.doExecute(args);
    }

    public getName() {
        return this.name;
    }

    public getValidArgs() {
        return this.validArgs;
    }
}

export default Runtime;