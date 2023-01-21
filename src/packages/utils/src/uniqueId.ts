export const uniqueId = (prefix?: string) => {
	let count = 0;

	return {
		next() {
			count++;

			return `${prefix}/${count}`;
		},
		reset() {
			count = 0;
		}
	};
};
