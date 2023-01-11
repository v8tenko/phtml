import { Effect } from '../typings/phtml';

export type UseState<T> = {
	type: 'state';
	value: T;
};

export type UseMemo<T> = {
	type: 'memo';
	computed: T;
	dependencies: any[];
};

export type UseEffect = {
	type: 'effect';
	callback: Effect;
	dependencies?: readonly any[];
	invoked: boolean;
};

export type HookState<T> = UseState<T> | UseMemo<T> | UseEffect;
export type IndexedHookState<T> = T & { id: number };
