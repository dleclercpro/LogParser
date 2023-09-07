import MemoryStrategy from './models/strategies/MemoryStrategy';
import StreamsStrategy from './models/strategies/StreamsStrategy';
import { loadEnvironment } from './utils/env';

export const ENV = loadEnvironment();
export const LOCALE = 'en';
export const N_LOGS = 10_000;
export const STRATEGIES = [new StreamsStrategy(), new MemoryStrategy()];