import LogFile from "../files/LogFile";

export interface IImporter {
    import(filepath: LogFile): Promise<string>;
}

abstract class Importer implements IImporter {
    public abstract import(file: LogFile): Promise<string>;
}

export default Importer;