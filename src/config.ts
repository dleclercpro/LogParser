import path from 'path';
import MemoryStrategy from './models/strategies/MemoryStrategy';
import StreamsStrategy from './models/strategies/StreamsStrategy';
import { loadEnvironment } from './utils/env';
import { StrategyName } from './models/strategies/Strategy';

export const ROOT_DIR = path.resolve(__dirname, '..');
export const ENV = loadEnvironment();
export const LOCALE = 'en';
export const N_LOGS_RUNTIME_NORMAL = 10_000;
export const N_LOGS_RUNTIME_PERFORMANCE_COMPARISON = [100, 1_000, 10_000];
export const STRATEGIES = {
    [StrategyName.Streams]: new StreamsStrategy(),
    [StrategyName.Memory]: new MemoryStrategy(),
};