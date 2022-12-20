import PHTML from '../phtml/phtml';

import { UseState } from './hooks.state';

type UseStateReturn<T> = [T, (newState: T) => void];

export const useState = <T>(initial: T): UseStateReturn<T> => {
	const { value, id } = PHTML.getHookState<T, UseState<T>>({
		value: initial,
		type: 'state'
	});

	const setState = (newState: T): void => {
		PHTML.patchHookState(id, { value: newState }, { update: true });
	};

	return [value, setState];
};
