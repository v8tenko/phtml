import { invoke } from '@v8tenko/utils';

import PHTML from '../phtml/phtml';

import { UseState } from './hooks.state';

type UseStateReturn<T> = [T, (newState: T | ((oldState: T) => T)) => void];

export const useState = <T>(initial: T): UseStateReturn<T> => {
	const { value, id } = PHTML.getHookState<T, UseState<T>>({
		value: initial,
		type: 'state'
	});

	const setState = (newState: T | ((oldState: T) => T)): void => {
		const { value } = PHTML.getHookStateById<UseState<T>>(id);

		PHTML.patchHookState(id, { value: invoke(newState, value) }, { update: true });
	};

	return [value, setState];
};
