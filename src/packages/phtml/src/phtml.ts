import { Nullable } from '@v8tenko/utils';

import { ComponentMetadata, Hook, HookId } from './hooks/hooks.state';
import { Effect, FC, VirtualDOMTree } from './typings/phtml';
import { Component } from './vdom/node/component';
import { mount } from './vdom/render/mount';

namespace PHTML {
	const lastHookIndex = 0;
	const hooksState: Record<HookId, Hook<unknown>> = {};
	const components: Record<string, ComponentMetadata> = {};
	const effects: Effect[] = [];
	let currentTree: Nullable<VirtualDOMTree> = null;

	export function registerEffect(effect: Effect) {
		effects.push(effect);
	}

	export function componentWillCreate(id: string) {
		components[id] = { ids: [] };
	}

	export function componentDidCreate(component: Component) {
		console.log('created: ', component);
	}

	export function getHookState() {}

	export namespace DOM {
		export function render(target: HTMLElement, component: FC<{}>) {
			const root = mount(target, component);

			currentTree = root;

			console.log(currentTree);
		}
	}
}

export default PHTML;
