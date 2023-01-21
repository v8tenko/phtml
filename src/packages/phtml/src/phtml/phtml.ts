import { assert, isNotNull, Nullable } from '@v8tenko/utils';

import { Hook, HookId, HookState, UseEffect } from '../hooks/hooks.state';
import { Component, Effect, IndexedEffect } from '../typings/phtml';
import { mount, VNodeComponent, VNodeComponentMetadata } from '../vdom';
import { patchNode } from '../vdom/render/patch';

type PatchHookStateOptions = {
	/**
	 * Should call PHTML.DOM.update() after hook's data changed
	 */
	update?: boolean;
};

namespace PHTML {
	let currentHookIndex = 1;
	let currentHookPosition: Nullable<number> = null;
	let componentInProgress: Partial<VNodeComponentMetadata> = {};
	let lastHookId = 1;
	const effects: IndexedEffect[] = [];
	const hooksState: Record<HookId, HookState<Hook<unknown>>> = {};
	const componentById: Record<string, VNodeComponent> = {};

	export function getHookState<T, State extends Hook<T>>(defaultState: State): HookState<State> {
		if (isNotNull(currentHookPosition)) {
			const { __hooksIds } = componentById[componentInProgress.__id!];
			const hookId = __hooksIds![currentHookPosition];

			currentHookPosition++;

			if (currentHookPosition === __hooksIds?.length) {
				currentHookPosition = null;
			}

			return hooksState[hookId] as any;
		}

		componentInProgress.__hooksIds!.push(currentHookIndex);

		if (hooksState[currentHookIndex]) {
			const currentHookState = hooksState[currentHookIndex];

			assert(currentHookState.type === defaultState.type, 'PHTML error: hooks data is corrupted');

			Object.assign(currentHookState, { meta: componentInProgress });

			currentHookIndex++;

			// @todo - replace with correct type
			return currentHookState as any;
		}

		const currentHookState = { ...defaultState, id: currentHookIndex, meta: componentInProgress };

		hooksState[currentHookIndex] = currentHookState;

		lastHookId++;
		currentHookIndex++;

		return currentHookState;
	}

	export function getHookStateById<T extends Hook<any>>(id: HookId): HookState<T> {
		// @todo - replace with correct type
		return hooksState[id] as any;
	}

	export function patchHookState<T>(
		id: HookId,
		nextHookState: Partial<HookState<Hook<T>>>,
		options: PatchHookStateOptions = {}
	) {
		Object.assign(hooksState[id], nextHookState);

		const { meta } = hooksState[id];

		if (options.update) {
			PHTML.DOM.update(meta);
		}
	}

	export function registerEffect(effect: Effect, id: HookId) {
		effects.push({
			effect,
			id
		});
	}

	const runEffects = () => {
		while (effects.length) {
			const { effect, id } = effects.pop()!;
			const cleanup = effect();

			if (typeof cleanup === 'function') {
				patchHookState(id, { cleanup });
			}
		}
	};

	export function componentWillCreate(componentMetadata: VNodeComponentMetadata) {
		if (componentMetadata.__hooksIds?.length) {
			currentHookIndex = componentMetadata.__hooksIds[0];
			currentHookPosition = 0;
		} else {
			currentHookIndex = lastHookId;
		}
		componentInProgress = componentMetadata;
	}

	export function componentDidCreate(component: VNodeComponent) {
		const { __hooksIds } = component;

		currentHookPosition = null;

		__hooksIds?.forEach((id) => {
			patchHookState(id, { meta: component });
		});

		componentById[component.__id!] = component;
	}

	export function componentWillUnmount(component: VNodeComponent) {
		delete componentById[component.__id!];
		const { __hooksIds } = component;

		__hooksIds?.forEach((id) => {
			if (hooksState[id].type === 'effect') {
				(hooksState[id] as UseEffect).cleanup?.();
			}
			delete hooksState[id];
		});
	}

	export function attatchComponentToView(component: VNodeComponent, view: HTMLElement) {
		componentById[component.__id!].__target = view;
	}

	export namespace DOM {
		export function render(target: HTMLElement, component: Component<{}>) {
			mount(target, component);
			runEffects();
		}

		export function update(meta: VNodeComponentMetadata) {
			// we cant call update before first render, cos it only calls from state
			const { __target, __update: __update, __id } = meta;
			const oldComponent = componentById[__id!];

			const nextComponent = __update!(oldComponent);

			patchNode(__target!, oldComponent, nextComponent);
			runEffects();

			Object.assign(oldComponent, nextComponent);
		}
	}
}

export default PHTML;
