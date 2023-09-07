import logger from '../../logger';
import { createFile, deleteFile, getFileSize, touchFile, readFile, writeFile } from '../../utils/file';
import PipeRead from '../pipes/PipeRead';
import PipeWrite from '../pipes/PipeWrite';

abstract class LogFile {
    protected path: string;
    protected pipeFrom?: PipeRead;
    protected pipeTo?: PipeWrite;

    constructor(path: string) {
        this.path = path;
    }

    public getSize() {
        return getFileSize(this.path);
    }

    public getPath() {
        return this.path;
    }

    public getPipeFrom() {
        return new PipeRead(this.path);
    }

    public getPipeTo() {
        return new PipeWrite(this.path);
    }

    public async touch() {
        const isNew = await touchFile(this.path);
        
        return isNew;
    }

    public async create() {
        logger.trace(`Creating file: ${this.path}`);
        
        await createFile(this.path);
    }

    public async delete() {
        logger.trace(`Deleting file: ${this.path}`);

        await deleteFile(this.path);
    }

    public async read(options?: { encoding: BufferEncoding }) {
        logger.trace(`Reading from file: ${this.path}`);
        
        const file = await readFile(this.path, options);

        return file;
    }

    public async write(data: string) {
        logger.trace(`Writing to file: ${this.path}`);
        
        await writeFile(this.path, data);
    }
}

export default LogFile;