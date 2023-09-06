import { Time } from '../types';
import { toMs } from './units';

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