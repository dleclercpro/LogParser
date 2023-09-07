import LogHistory from '../logs/LogHistory';
import Exporter from './Exporter';

class JSONExporter extends Exporter {

    public serialize(history: LogHistory) {
        return JSON.stringify(history.toJSON(), undefined, 2);
    }
}

export default JSONExporter;