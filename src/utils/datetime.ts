export function getNowAsISO(): string {
    return new Date().toISOString();
}

export function oneHourFromNow(): number {
    return Math.floor(Date.now() / 1000) + (60 * 60);
}