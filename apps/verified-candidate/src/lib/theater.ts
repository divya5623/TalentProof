/** Timed UI theater helper for parse / connect / grade delays. */
export const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));
