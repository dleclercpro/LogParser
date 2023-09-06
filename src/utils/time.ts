import { Time, TimeUnit } from '../types';
import { round } from './math';

export const sleep = async (time: Time) => {
    await new Promise(resolve => setTimeout(resolve, toMs(time)));
};

export const isValidISODate = (date: string) => {
    try {
        return new Date(date).toISOString() === date;
    } catch {
        return false;
    }
}

export const isValidEpochDate = (date: number) => {
    try {
        return new Date(date).getTime() === date;
    } catch {
        return false;
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

    return `~${round(t, 3)}${u}`;
}