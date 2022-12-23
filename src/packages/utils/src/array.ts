export const array = <T>(values: T | T[]): T[] => (Array.isArray(values) ? values : [values]);
