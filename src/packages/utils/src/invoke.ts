export const invoke = <T, Args extends any[]>(invokable: T | ((...args: Args) => T), ...args: Args): T => {
	if (typeof invokable === 'function') {
		return (invokable as Function)(...args);
	}

	return invokable;
};
