export const sleep = async (ms: number) => {
    return new Promise<void>((resolve, reject) => {
        setTimeout(() => {
            resolve();
        }, ms);
    });
}

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