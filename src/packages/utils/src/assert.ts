export const assert = (condition: boolean, error?: string) => {
	if (condition) {
		return;
	}

	throw Error(error || 'Assertion failed');
};
