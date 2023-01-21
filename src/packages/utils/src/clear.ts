export const clearObj = <T>(value: T): T => {
	if (Array.isArray(value)) {
		value.length = 0;

		return value;
	}

	for (const prop of Object.getOwnPropertyNames(value)) {
		delete (value as any)[prop];
	}

	return value;
};

export const clear = <T extends any[]>(...targets: T): T => {
	targets.forEach(clearObj);

	return targets;
};
