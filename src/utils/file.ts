import fs from 'fs';
import path from 'path';
import logger from '../logger';
import { Memory, MemoryUnit } from '../types';
import { round } from './math';

export const toBytes = ({ size, unit }: Memory) => {
    switch (unit) {
        case MemoryUnit.Gigabytes:
            return size * Math.pow(1_000, 3);
        case MemoryUnit.Megabytes:
            return size * Math.pow(1_000, 2);
        case MemoryUnit.Kilobytes:
            return size * Math.pow(1_000, 1);
        case MemoryUnit.Bytes:
            return size;
        default:
            throw new Error('Invalid memory unit.');
    }
}

export const formatSize = (memory: Memory) => {
    let s = toBytes(memory);
    let u = MemoryUnit.Bytes;

    // ms -> s
    if (s >= 1_000) {
        s /= 1_000;
        u = MemoryUnit.Kilobytes;

        // s -> m
        if (s >= 1_000) {
            s /= 1_000;
            u = MemoryUnit.Megabytes;

            // m -> h
            if (s >= 1_000) {
                s /= 1_000;
                u = MemoryUnit.Gigabytes;
            }
        }
    }

    return `~${round(s, 1)}${u}`;
}

export const deleteFile = async (filepath: string) => {

    // Ignore missing file
    const opts = { force: true };

    return new Promise<void>((resolve, reject) => {
        fs.rm(filepath, opts, (err) => {
            if (err) reject(err);
    
            resolve();
        });
    });
}

export const readFile = (filepath: string, options = { encoding: 'utf-8' as BufferEncoding }) => {
    return new Promise<string>((resolve, reject) => {
        fs.readFile(filepath, options, (err, data) => {
            if (err) reject(err);

            logger.trace(`Read ${data.length} bytes from file: ${filepath}`);

            resolve(data);
        });
    });
}

export const writeFile = async (filepath: string, data: string) => {
    return new Promise<void>((resolve, reject) => {
        fs.writeFile(filepath, data, (err) => {
            if (err) reject(err);
    
            resolve();
        });
    });
}

export const appendToFile = async (filepath: string, data: string) => {
    return new Promise<void>((resolve, reject) => {
        fs.open(filepath, 'a+', (openErr, file) => {
            if (openErr) reject(openErr);

            fs.write(file, data, (writeErr) => {
                if (writeErr) reject(writeErr);

                fs.close(file, (closeErr) => {
                    if (closeErr) reject(closeErr);

                    logger.trace(`Wrote ${data.length} bytes to file: ${filepath}`);

                    resolve();
                });
            });
        });
    });
}

export const touchFile = async (filepath: string) => {
    const exists = fs.existsSync(filepath);

    if (!exists) {
        fs.mkdirSync(path.dirname(filepath), { recursive: true });
        
        await createFile(filepath);

        // New file generated
        return true;
    }

    // No new file generated
    return false;
}

export const createFile = async (filepath: string) => {
    await writeFile(filepath, '');
}

export const truncateFile = async (filepath: string, bytes: number) => {
    const { size } = await getFileSize(filepath);

    return new Promise<void>((resolve, reject) => {
        fs.truncate(filepath, size - bytes, (err) => {
            if (err) reject(err);

            logger.trace(`Truncated ${bytes} bytes from file: ${filepath}`);

            resolve();
        });
    });
}

export const getFileSize = (filepath: string) => {
    const { size } = fs.statSync(filepath);

    return { size, unit: MemoryUnit.Bytes };
}

export const readJSON = async (filepath: string) => {
    return JSON.parse(await readFile(filepath));
}

export const writeJSON = async (filepath: string, data: any) => {
    await writeFile(filepath, JSON.stringify(data));
}