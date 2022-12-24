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
	// @todo patch unmount event
	callback(): void;
	dependencies: any[];
	invoked: boolean;
};

export type HookState<T> = UseState<T> | UseMemo<T> | UseEffect;
export type IndexedHookState<T> = T & { id: number };
