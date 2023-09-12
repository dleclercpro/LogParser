import path from 'path';
import MemoryStrategy from './models/strategies/MemoryStrategy';
import StreamsStrategy from './models/strategies/StreamsStrategy';
import { loadEnvironment } from './utils/env';
import { StrategyName } from './models/strategies/Strategy';

export const ROOT_DIR = path.resolve(__dirname, '..');
export const ENV = loadEnvironment();
export const LOCALE = 'en';
export const N_LOGS_RUNTIME_NORMAL = 10_000;
export const N_LOGS_RUNTIME_PERFORMANCE_COMPARISON = [50, 100, 500, 1_000, 5_000, 10_000, 50_000, 100_000, 500_000, 1_000_000];
export const STRATEGIES = {
    [StrategyName.Streams]: new StreamsStrategy(),
    [StrategyName.Memory]: new MemoryStrategy(),
};