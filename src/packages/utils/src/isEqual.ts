function isPrimitive(obj: unknown): boolean {
	return obj !== Object(obj);
}

export const isEqual = (a: any, b: any): boolean => {
	if (a === b) return true;

	if (isPrimitive(a) && isPrimitive(b)) {
		return a === b;
	}

	if (Object.keys(a).length !== Object.keys(b).length) return false;

	for (const key in a) {
		if (!(key in b)) {
			return false;
		}
		if (!isEqual(a[key], b[key])) {
			return false;
		}
	}

	return true;
};
