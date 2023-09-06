import { createFile, deleteFile, getFileSize, touchFile } from '../../utils/file';
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
        await createFile(this.path);
    }

    public async delete() {
        await deleteFile(this.path);
    }
}

export default LogFile;