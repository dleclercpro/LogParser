import MemoryStrategy from './models/strategies/MemoryStrategy';
import StreamsStrategy from './models/strategies/StreamsStrategy';
import { loadEnvironment } from './utils/env';

export const ENV = loadEnvironment();
export const N_LOGS = 500_000;
export const STRATEGIES = [new StreamsStrategy(), new MemoryStrategy()];