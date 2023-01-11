export const isNull = <T>(value: T | null | undefined): value is null | undefined =>
	value === null || value === undefined;

export const isNotNull = <T>(value: T | null | undefined): value is T => {
	return !isNull(value);
};
