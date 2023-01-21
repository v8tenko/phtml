import { withPrevious } from './previous';

it('old function', () => {
	const value = withPrevious(1);

	expect(value.current).toBe(1);
	expect(value.previous).toBe(null);

	value.next(10);

	expect(value.current).toBe(10);
	expect(value.previous).toBe(1);

	value.next(-1);

	expect(value.current).toBe(-1);
	expect(value.previous).toBe(10);
});

export {};
