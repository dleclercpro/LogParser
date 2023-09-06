import { Memory, MemoryUnit, Time, TimeUnit } from '../types';
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

export const toMs = ({ time, unit }: Time) => {
    switch (unit) {
        case TimeUnit.Days:
            return time * 24 * 3_600 * 1_000;
        case TimeUnit.Hours:
            return time * 3_600 * 1_000;
        case TimeUnit.Minutes:
            return time * 60 * 1_000;
        case TimeUnit.Seconds:
            return time * 1_000;
        case TimeUnit.Milliseconds:
            return time;
        default:
            throw new Error('Invalid time unit.');
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

export const formatTime = (time: Time) => {
    let t = toMs(time);
    let u = TimeUnit.Milliseconds;

    // ms -> s
    if (t >= 1_000) {
        t /= 1_000;
        u = TimeUnit.Seconds;

        // s -> m
        if (t >= 60) {
            t /= 60;
            u = TimeUnit.Minutes;

            // m -> h
            if (t >= 60) {
                t /= 60;
                u = TimeUnit.Hours;

                // h -> d
                if (t >= 24) {
                    t /= 24;
                    u = TimeUnit.Days;
                }
            }
        }
    }

    return `~${round(t, 1)}${u}`;
}