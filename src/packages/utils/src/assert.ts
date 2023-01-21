import { isNotNull, isNull } from './isNull';
import { NotNull, Nullable } from './types';

export const assert = (condition: boolean, error?: string) => {
	if (condition) {
		return;
	}

	throw Error(error || 'Assertion failed');
};

export const assertWarn = (condition: boolean, warnMessage?: string) => {
	if (condition) {
		return;
	}

	// eslint-disable-next-line no-console
	console.warn(warnMessage || 'Assertion failed');
};

export const assertNever = (error?: string): never => {
	throw Error(error || 'Assertion failed');
};

export const assertNotNull = <T>(value: Nullable<T>): value is NotNull<T> => {
	assert(isNotNull(value));

	return true;
};

export const assertNull = <T>(value: Nullable<T>): value is null | undefined => {
	assert(isNull(value));

	return true;
};
