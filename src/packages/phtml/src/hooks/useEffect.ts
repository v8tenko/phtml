import { isEqual } from '@v8tenko/utils';

import PHTML from '../phtml/phtml';

import { UseEffect } from './hooks.state';

export const useEffect = (callback: () => any, dependencies?: any[]) => {
	const {
		dependencies: oldDependencies,
		invoked,
		id
	} = PHTML.getHookState<unknown, UseEffect>({
		callback,
		dependencies,
		type: 'effect',
		invoked: false
	});

	if (!invoked) {
		PHTML.registerEffect(callback);
	}

	if (oldDependencies === undefined || !isEqual(dependencies, oldDependencies)) {
		PHTML.registerEffect(callback);
	}

	PHTML.patchHookState(id, { dependencies, invoked: true });
};
