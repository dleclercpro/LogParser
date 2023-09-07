import LogHistory from '../logs/LogHistory';
import LogFile from '../files/LogFile';

export interface IExporter {
    serialize(history: LogHistory): string;
    export(file: LogFile, history: LogHistory): Promise<void>;
}

abstract class Exporter implements IExporter {
    public abstract serialize(history: LogHistory): string;

    public async export(file: LogFile, history: LogHistory) {
        const logs = this.serialize(history);

        await file.write(logs);
    }
}

export default Exporter;