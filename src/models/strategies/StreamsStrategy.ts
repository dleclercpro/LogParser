import { LogJSON, Severity } from '../../types';
import TextToJSONLogsAdapter from '../adapters/TextToJSONLogsAdapter';
import JSONLogFile from '../files/JSONLogFile';
import TextLogFile from '../files/TextLogFile';
import Strategy, { StrategyName } from './Strategy';

const createSeverityFilter = (severity?: Severity) => {
    if (severity) {
        return ({ level }: LogJSON) => level === severity;
    }
    return () => true;
}

class StreamsStrategy extends Strategy {
    private static instance?: StreamsStrategy;
    protected label: string = StrategyName.Streams;

    private constructor() {
        super();
    }

    public static getInstance() {
        if (!this.instance) {
            this.instance = new StreamsStrategy();
        }

        return this.instance;
    }

    public async run(inputFile: TextLogFile, outputFile: JSONLogFile, severity?: Severity) {
        this.inputFile = inputFile;
        this.outputFile = outputFile;

        const adapter = new TextToJSONLogsAdapter(createSeverityFilter(severity));

        await this.start();
        await adapter.execute(inputFile, outputFile);
        await this.end();

        return this.duration;
    }
}

export default StreamsStrategy.getInstance();