export const withPrevious = <T>(initial: T) => {
	const prev = {
		next(newValue: T) {
			prev.previous = prev.current;
			prev.current = newValue;
		},
		current: initial,
		previous: null as T | null
	};

	return prev;
};
