import { assert } from '@v8tenko/utils';
import { mount, VNode, VDOM } from '@v8tenko/vdom';

import { HookState, IndexedHookState } from '../hooks/hooks.state';

type PatchHookStateOptions = {
	/**
	 * Should call PHTML.DOM.update() after hook's data changed
	 */
	update?: boolean;
};

namespace PHTML {
	let app: Component | undefined;
	let oldVNodeRoot: VNode | undefined;
	let oldDomRoot: HTMLElement | undefined;
	let currentHookIndex = 0;
	const hooksState: Record<number, IndexedHookState<any>> = {};

	export namespace DOM {
		export function render(target: HTMLElement, component: Component<{}>) {
			currentHookIndex = 0;
			app = component;
			const nextVNodeRoot = app();

			if (!oldVNodeRoot) {
				oldDomRoot = mount(target, nextVNodeRoot);
				oldVNodeRoot = nextVNodeRoot;

				return;
			}

			oldDomRoot = VDOM.patchNode(oldDomRoot!, oldVNodeRoot, nextVNodeRoot) as HTMLElement | undefined;
			oldVNodeRoot = nextVNodeRoot;
		}

		export function update() {
			// we cant call update before first render, cos it only calls from state
			if (!oldDomRoot || !app) {
				throw new Error(
					"Unable to perform update: DOMNodeRoot or App is not defined. Maybe you didn't call PHTML.DOM.render()"
				);
			}
			render(oldDomRoot, app);
		}
	}

	export function getHookState<T, State extends HookState<T>>(defaultState: State): IndexedHookState<State> {
		if (hooksState[currentHookIndex]) {
			const currentHookState = hooksState[currentHookIndex];

			assert(currentHookState.type === defaultState.type, 'PHTML error: hooks data is corrupted');

			currentHookIndex++;

			return currentHookState;
		}

		const currentHookState = { ...defaultState, id: currentHookIndex };

		hooksState[currentHookIndex] = currentHookState;
		currentHookIndex++;

		return currentHookState;
	}

	export const getHookStateById = <T, State extends HookState<T>>(id: number): IndexedHookState<State> => {
		return hooksState[id];
	};

	export function patchHookState<T>(
		id: number,
		nextHookState: Partial<HookState<T>>,
		options: PatchHookStateOptions = {}
	) {
		Object.assign(hooksState[id], nextHookState);
		if (options.update) {
			PHTML.DOM.update();
		}
	}
}

export default PHTML;
