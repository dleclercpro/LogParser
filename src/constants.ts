import { Severity } from './types';

export const NEW_LINE_REGEXP = /[\r\n]+/;
export const NEW_LINE = '\n';

export const SEVERITY_ORDERING = [
    Severity.Trace,
    Severity.Debug,
    Severity.Info,
    Severity.Warn,
    Severity.Error,
    Severity.Fatal,
];