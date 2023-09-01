import fs from 'fs';
import logger from '../logger';

export const deleteFile = async (path: string) => {

    // Ignore missing file
    const opts = { force: true };

    return new Promise<void>((resolve, reject) => {
        fs.rm(path, opts, (err) => {
            if (err) reject(err);
    
            resolve();
        });
    });
}

export const readFile = (path: string, options = { encoding: 'utf-8' as BufferEncoding }) => {
    return new Promise<string>((resolve, reject) => {
        fs.readFile(path, options, (err, data) => {
            if (err) reject(err);

            logger.trace(`Read ${data.length} bytes from file: ${path}`);

            resolve(data);
        });
    });
}

export const writeFile = async (path: string, data: string) => {
    return new Promise<void>((resolve, reject) => {
        fs.writeFile(path, data, (err) => {
            if (err) reject(err);
    
            resolve();
        });
    });
}

export const appendToFile = async (path: string, data: string) => {
    return new Promise<void>((resolve, reject) => {
        fs.open(path, 'a+', (openErr, file) => {
            if (openErr) reject(openErr);

            fs.write(file, data, (writeErr) => {
                if (writeErr) reject(writeErr);

                fs.close(file, (closeErr) => {
                    if (closeErr) reject(closeErr);

                    logger.trace(`Wrote ${data.length} bytes to file: ${path}`);

                    resolve();
                });
            });
        });
    });
}

export const truncateFile = async (path: string, len: number) => {
    const size = await getFileSize(path);

    return new Promise<void>((resolve, reject) => {
        fs.truncate(path, size - len, (err) => {
            if (err) reject(err);

            logger.trace(`Truncated ${len} bytes from file: ${path}`);

            resolve();
        });
    });
}

export const getFileSize = async (path: string, options = { encoding: 'utf-8' as BufferEncoding }) => {
    const data = await readFile(path, options);

    return data.length;
}

export const readJSON = async (path: string) => {
    return JSON.parse(await readFile(path));
}

export const writeJSON = async (path: string, data: any) => {
    await writeFile(path, JSON.stringify(data));
}