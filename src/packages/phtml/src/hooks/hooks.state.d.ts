export type UseState<T> = {
	type: 'state';
	value: T;
};

export type UseMemo<T> = {
	type: 'memo';
	computed: T;
	dependencies: any[];
};

export type HookState<T> = UseState<T> | UseMemo<T>;
export type IndexedHookState<T> = T & { id: number };
