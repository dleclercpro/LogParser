export enum Environment {
    Development = 'development',
    Test = 'test',
    Production = 'production',
}

export type Time = {
    time: number,
    unit: TimeUnit,
}

export type Memory = {
    size: number,
    unit: MemoryUnit,
}

export enum TimeUnit {
    Days = 'D',
    Hours = 'h',
    Minutes = 'm',
    Seconds = 's',
    Milliseconds = 'ms',
}

export enum MemoryUnit {
    Bytes = 'B',
    Kilobytes = 'KB',
    Megabytes = 'MB',
    Gigabytes = 'GB',
}

export enum Severity {
    Trace = 'trace',
    Debug = 'debug',
    Info = 'info',
    Warn = 'warn',
    Error = 'error',
    Fatal = 'fatal',
}

export interface StreamOptions {
    flags?: string;
    encoding?: BufferEncoding;
}

// Ignored irrelevant types for the task (user, order, ...)
export interface LogLine {
    level: Severity,
    timestamp: Date,
    transactionId: string,
    details: string,
    code?: number,
    err?: number,
}

export interface LogJSON {
    level: string,
    timestamp: string
    transactionId: string,
    err?: string,
}