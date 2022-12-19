import type { VNode } from '@v8tenko/vdom';

declare global {
	type Component<Props = {}> = (...args: Props) => VNode;
}

export {};
