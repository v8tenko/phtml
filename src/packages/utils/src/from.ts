/**
 * @param b first collection
 * @param a second collection
 * @returns all elements from b, that exists in a
 */
export const from = <T>(b: T[], a: T[]): T[] => {
	return a.filter((el) => b.includes(el));
};
