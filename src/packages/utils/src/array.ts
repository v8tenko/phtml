export const array = <T extends any>(values: T | T[]): T[] => (Array.isArray(values) ? values : [values]);
