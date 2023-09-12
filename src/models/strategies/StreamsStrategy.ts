import { LogJSON, Severity } from '../../types';
import TextToJSONLogsAdapter from '../adapters/TextToJSONLogsAdapter';
import JSONLogFile from '../files/JSONLogFile';
import TextLogFile from '../files/TextLogFile';
import Strategy from './Strategy';

const createSeverityFilter = (severity?: Severity) => {
    if (severity) {
        return ({ level }: LogJSON) => level === severity;
    }
    return () => true;
}

class StreamsStrategy extends Strategy {
    protected name: string = 'Streams';

    public async run(inputFile: TextLogFile, outputFile: JSONLogFile, severity?: Severity) {
        this.inputFile = inputFile;
        this.outputFile = outputFile;

        const adapter = new TextToJSONLogsAdapter(createSeverityFilter(severity));

        await this.start();
        await adapter.execute(inputFile, outputFile);
        await this.end();

        return this.durations.total;
    }
}

export default StreamsStrategy;