export const assert = (condition: boolean, error?: string) => {
	console.log('asserting...');
	if (condition) {
		return;
	}

	throw Error(error || 'Assertion failed');
};
