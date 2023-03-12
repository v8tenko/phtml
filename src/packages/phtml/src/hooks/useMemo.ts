import { assert, isEqual } from '@v8tenko/utils';

import PHTML from '../phtml';

import { UseMemo } from './hooks.state';

type Compution<T> = () => T;

export const useMemo = <T>(compution: Compution<T>, dependencies: any[]): T => {
	const {
		computed,
		id,
		dependencies: oldDependencies
	} = PHTML.getHookState<T, UseMemo<T>>({
		computed: compution(),
		type: 'memo',
		dependencies
	});

	assert(oldDependencies.length === dependencies.length, 'useMemo hook error: unable to use dynimic dependencies');

	if (isEqual(dependencies, oldDependencies)) {
		return computed;
	}

	const updatedValue = compution();

	PHTML.patchHookState(id, { value: updatedValue });

	return updatedValue;
};
