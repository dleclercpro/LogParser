export enum Environment {
    Development = 'development',
    Test = 'test',
    Production = 'production',
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

export type LogFilter = (log: LogJSON) => boolean;