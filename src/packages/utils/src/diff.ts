import { indexed } from './indexed';

type DiffResult = {
	added: number[];
	removed: number[];
};

/**
 * @returns {DiffResult<T>[]} all elements from a, that wasn't in b
 */
export const diff = <T>(a: T[], b: T[]): DiffResult => {
	const added = indexed(b)
		.filter((el) => !a.includes(el[0]))
		.map(([, i]) => i);
	const removed = indexed(a)
		.filter((el) => !b.includes(el[0]))
		.map(([, i]) => i);

	return {
		added,
		removed
	};
};
