import type * as PHTMLTypgins from './phtml';

declare global {
	declare namespace PHTML {
		export = PHTMLTypgins;
	}

	declare namespace JSX {
		interface IntrinsicElements {
			[componentName: string]: any;
			Fragment: {};
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
