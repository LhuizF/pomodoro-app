export function secondsToMin(seconds: number): string {
    const time = (n: number) => new Date(n * 1000).toISOString().substr(14, 5);
    return `${time(seconds)}`;
}

export function secondsToHours(seconds: number): string {
    const time = (n: number) => new Date(n * 1000).toISOString().substr(11, 8);
    return `${time(seconds)}`;
}
