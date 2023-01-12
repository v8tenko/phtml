import { assertNever, Nullable } from '@v8tenko/utils';

import { isDocumentFragment } from '../node/node.dom';

export namespace DOM {
	type Options =
		| {
				target: HTMLElement | undefined;
				mode: 'after' | 'append';
				node: Nullable<Node>;
		  }
		| {
				target: HTMLElement | undefined;
				mode: 'before';
				node: Nullable<Node>;
				// undefined means append
				before: HTMLElement | number | undefined;
		  }
		| {
				target: HTMLElement | undefined;
				mode: 'replace';
				node: Nullable<Node>;
		  };

	export function render(options: Options): number {
		const { mode, node, target } = options;

		if (!node) {
			return 0;
		}

		if (!target) {
			throw new Error('VDOM error: unable to commit operation: target is not defined');
		}

		const childLength = isDocumentFragment(node) ? node.childNodes.length : 1;

		if (mode === 'after') {
			target.after(node);

			return childLength;
		}

		if (mode === 'append') {
			target.after(node);

			return childLength;
		}

		if (mode === 'replace') {
			target.replaceWith(node);

			return 0;
		}

		if (mode === 'before') {
			const { before } = options;
			let beforeNode: HTMLElement | undefined;

			if (typeof before === 'number') {
				beforeNode = target.childNodes.item(before) as HTMLElement | undefined;
			} else {
				beforeNode = before;
			}

			target.insertBefore(node, beforeNode as HTMLElement | null);

			return childLength;
		}

		assertNever(`No action for mode: ${mode}`);

		return -1;
	}

	export function unmount(...nodes: (HTMLElement | undefined)[]): number {
		const notEmptyNodes = nodes.filter(Boolean) as HTMLElement[];

		notEmptyNodes.forEach((node) => {
			node.remove();
		});

		return notEmptyNodes.length;
	}
}
