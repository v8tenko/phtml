import { patchNode, mount, VNode } from '@v8tenko/vdom';

import { HookState, PureHookState } from '../hooks/hooks.state';

namespace PHTML {
	let app: Component | undefined;
	let oldVNodeRoot: VNode | undefined;
	let oldDomRoot: HTMLElement | undefined;
	let currentHookIndex = 0;
	const hooksState: Record<number, HookState<any>> = {};

	export abstract class DOM {
		static render(target: HTMLElement, component: Component<{}>) {
			currentHookIndex = 0;
			app = component;
			const nextVNodeRoot = app();

			console.log(oldVNodeRoot, nextVNodeRoot);

			if (!oldVNodeRoot) {
				oldDomRoot = mount(target, nextVNodeRoot);
				oldVNodeRoot = nextVNodeRoot;

				return;
			}

			oldDomRoot = patchNode(oldDomRoot!, oldVNodeRoot, nextVNodeRoot) as HTMLElement | undefined;
			oldVNodeRoot = nextVNodeRoot;
		}

		static update() {
			// we cant call update before first render, cos it only calls from state
			if (!oldDomRoot || !app) {
				throw new Error(
					"Unable to perform update: DOMNodeRoot or App is not defined. Maybe you didn't call PHTML.DOM.render()"
				);
			}
			this.render(oldDomRoot, app);
		}
	}

	export function getHookState<T>(defaultState: PureHookState<T>): HookState<T> {
		if (hooksState[currentHookIndex]) {
			const currentHookState = hooksState[currentHookIndex];

			currentHookIndex++;

			return currentHookState;
		}

		const currentHookState = { ...defaultState, id: currentHookIndex };

		hooksState[currentHookIndex] = currentHookState;
		currentHookIndex++;

		return currentHookState;
	}

	export function patchHookState<T>(id: number, nextHookState: PureHookState<T>) {
		hooksState[id] = { id, ...nextHookState };
		PHTML.DOM.update();
	}
}

export default PHTML;
