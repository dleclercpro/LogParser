import logger from '../../logger';
import { Severity } from '../../types';
import JSONExporter from '../exporters/JSONExporter';
import JSONLogFile from '../files/JSONLogFile';
import TextLogFile from '../files/TextLogFile';
import LogImporter from '../importers/LogImporter';
import LogParser from '../parsers/LogParser';
import Strategy from './Strategy';

class MemoryStrategy extends Strategy {
    protected name: string = 'Memory';

    public async run(inputFile: TextLogFile, outputFile: JSONLogFile, severity?: Severity) {
        this.inputFile = inputFile;
        this.outputFile = outputFile;
        
        const importer = new LogImporter();
        const exporter = new JSONExporter();
        const parser = new LogParser();

        await this.start();
    
        let history = parser.parse(await importer.import(inputFile));
        logger.info(`Found ${history.size()} log entries altogether.`);
    
        if (severity) {
            history = history.of(severity);
            logger.info(`Found ${history.size()} log entries of severity '${severity}'.`);    
        }

        await exporter.export(outputFile, history);

        await this.end();
    }
}

export default MemoryStrategy;