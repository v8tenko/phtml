import { Nullable } from '@v8tenko/utils';

import { CleanupEffect, Effect } from '../typings/phtml';

export type UseState<T> = {
	type: 'state';
	value: T;
};

export type UseMemo<T> = {
	type: 'memo';
	computed: T;
	dependencies: readonly any[];
};

export type UseEffect = {
	type: 'effect';
	callback: Effect;
	cleanup: Nullable<CleanupEffect>;
	dependencies: Nullable<readonly any[]>;
	invoked: boolean;
};

export type HookId = number;

export type ComponentMetadata = {
	ids: HookId[];
};

export type Hook<T> = UseState<T> | UseMemo<T> | UseEffect;
