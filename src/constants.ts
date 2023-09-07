import MemorySize, { MemoryUnit } from './models/MemorySize';
import TimeDuration, { TimeUnit } from './models/TimeDuration';
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

export const NO_TIME_DURATION = new TimeDuration(0, TimeUnit.Milliseconds);
export const NO_MEMORY_SIZE = new MemorySize(0, MemoryUnit.Bytes);