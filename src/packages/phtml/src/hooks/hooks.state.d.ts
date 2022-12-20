export type UseState<T> = {
	id: number;
	type: 'state';
	value: T;
};

export type HookState<T> = UseState<T>;
export type PureHookState<T> = Omit<HookState<T>, 'id'>;
