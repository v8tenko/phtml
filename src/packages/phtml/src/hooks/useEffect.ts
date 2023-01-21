import { isEqual } from '@v8tenko/utils';

import PHTML from '../phtml/phtml';
import { Effect } from '../typings/phtml';

import { UseEffect } from './hooks.state';

export const useEffect = (callback: Effect, dependencies?: any[]) => {
	const {
		dependencies: oldDependencies,
		invoked,
		id
	} = PHTML.getHookState<unknown, UseEffect>({
		callback,
		dependencies,
		type: 'effect',
		cleanup: null,
		invoked: false
	});

	if (!invoked) {
		PHTML.registerEffect(callback, id);
	}

	if (invoked && (oldDependencies === undefined || !isEqual(dependencies, oldDependencies))) {
		PHTML.registerEffect(callback, id);
	}

	PHTML.patchHookState(id, { dependencies: oldDependencies, invoked: true });
};
