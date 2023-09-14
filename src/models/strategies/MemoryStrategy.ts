import logger from '../../logger';
import { Severity } from '../../types';
import { capitalizeFirstCharacter } from '../../utils/string';
import JSONExporter from '../exporters/JSONExporter';
import JSONLogFile from '../files/JSONLogFile';
import TextLogFile from '../files/TextLogFile';
import LogImporter from '../importers/LogImporter';
import LogParser from '../parsers/LogParser';
import Strategy, { StrategyName } from './Strategy';

class MemoryStrategy extends Strategy {
    private static instance?: MemoryStrategy;
    protected name: string = capitalizeFirstCharacter(StrategyName.Memory);

    private constructor() {
        super();
    }

    public static getInstance() {
        if (!this.instance) {
            this.instance = new MemoryStrategy();
        }

        return this.instance;
    }

    public async run(inputFile: TextLogFile, outputFile: JSONLogFile, severity?: Severity) {
        this.inputFile = inputFile;
        this.outputFile = outputFile;
        
        const importer = new LogImporter();
        const exporter = new JSONExporter();
        const parser = new LogParser();

        await this.start();
    
        let history = parser.parse(await importer.import(inputFile));
        logger.info(`Found ${history.size({ format: true })} log entries altogether.`);
    
        if (severity) {
            history = history.of(severity);
            logger.info(`Found ${history.size({ format: true })} log entries of severity '${severity}'.`);    
        }

        await exporter.export(outputFile, history);

        await this.end();

        return this.duration;
    }
}

export default MemoryStrategy.getInstance();