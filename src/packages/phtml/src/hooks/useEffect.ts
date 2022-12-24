import { isEqual } from '@v8tenko/utils';

import PHTML from '../phtml/phtml';

import { UseEffect } from './hooks.state';

export const useEffect = <T>(callback: () => void, dependencies: any[]): void => {
	const {
		dependencies: oldDependencies,
		invoked,
		id
	} = PHTML.getHookState<T, UseEffect>({
		callback,
		dependencies,
		type: 'effect',
		invoked: false
	});

	if (PHTML.renderState !== 'applying_effects') {
		return;
	}

	if (!invoked) {
		callback();
	}

	if (!isEqual(dependencies, oldDependencies)) {
		callback();
	}

	PHTML.patchHookState<UseEffect>(id, { dependencies: oldDependencies, invoked: true });
};
