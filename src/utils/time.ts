import TimeDuration from '../models/TimeDuration';

export const sleep = async (duration: TimeDuration) => {
    await new Promise(resolve => setTimeout(resolve, duration.toMs().getAmount()));
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