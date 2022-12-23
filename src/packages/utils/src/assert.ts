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
