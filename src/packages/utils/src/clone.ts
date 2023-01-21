export const clone = <T>(obj: T): T => {
	const copy: any = Array.isArray(obj) ? [] : {};

	for (const key in obj) {
		const value = obj[key];

		copy[key] = typeof value === 'object' ? clone(value) : value;
	}

	return copy;
};
