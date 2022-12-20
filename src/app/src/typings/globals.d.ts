import type { VNode } from '@v8tenko/vdom';

declare global {
	type Component<Props = {}> = (args: Props) => VNode;

	declare namespace JSX {
		interface IntrinsicElements {
			[componentName: string]: any;
			input: {
				value?: string;
				placeholder?: string;
				onChange?: (event: any) => void;
				onInput?: (event: any) => void;
			};
		}
	}
}

export {};
