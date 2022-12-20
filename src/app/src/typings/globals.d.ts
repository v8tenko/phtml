import type { VNode } from '@v8tenko/vdom';

declare global {
	type Component<Props = {}> = (...args: Props) => VNode;

	declare namespace JSX {
		interface IntrinsicElements {
			[componentName: string]: any;
		}
	}
}

export {};
