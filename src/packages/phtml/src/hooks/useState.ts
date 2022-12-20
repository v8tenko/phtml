import { assert } from '@v8tenko/utils';

import PHTML from '../phtml/phtml';

import { UseState } from './hooks.state';

type UseStateReturn<T> = [T, (newState: T) => void];

export const useState = <T>(initial: T): UseStateReturn<T> => {
	const { value, id, type } = PHTML.getHookState<T>({
		value: initial,
		type: 'state'
	}) as UseState<T>;

	assert(type === 'state');

	const setState = (newState: T): void => {
		PHTML.patchHookState(id, { value: newState, type: 'state' });
	};

	return [value, setState];
};
