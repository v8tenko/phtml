export const indexed = <T>(array: T[]): [T, number][] => array.map((el, i) => [el, i]);
