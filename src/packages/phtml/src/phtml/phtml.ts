import { assert } from '@v8tenko/utils';
import { mount, VNode, VDOM, isList } from '@v8tenko/vdom';

import { HookState, IndexedHookState } from '../hooks/hooks.state';
import { Component, Effect } from '../typings/phtml';

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
	const effects: Effect[] = [];

	export function registerEffect(effect: Effect) {
		effects.push(effect);
	}

	const runEffects = () => {
		effects.forEach((effect) => {
			effect();
		});
	};

	export namespace DOM {
		const cleanup = () => {
			currentHookIndex = 0;
			effects.length = 0;
		};

		export function render(target: HTMLElement, component: Component<{}>) {
			cleanup();
			app = component;
			const nextVNodeRoot = app({});

			if (!oldVNodeRoot) {
				oldDomRoot = mount(target, nextVNodeRoot);
				oldVNodeRoot = nextVNodeRoot;
				runEffects();

				return;
			}

			if (isList(nextVNodeRoot)) {
				VDOM.patchChildren({ domNode: oldDomRoot!, oldChildren: oldVNodeRoot, nextChildren: nextVNodeRoot });
				oldDomRoot = target;
			} else {
				oldDomRoot = VDOM.patchNode(oldDomRoot!, oldVNodeRoot, nextVNodeRoot) as HTMLElement | undefined;
			}

			oldVNodeRoot = nextVNodeRoot;
			runEffects();
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

	export function getHookStateById<T, State extends HookState<T>>(id: number): IndexedHookState<State> {
		return hooksState[id];
	}

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
