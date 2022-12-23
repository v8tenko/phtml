import { array, assertNever } from '@v8tenko/utils';

export namespace DOM {
	type Options =
		| {
				target: HTMLElement | undefined;
				mode: 'after' | 'append';
				node: (Node | null) | (Node | null)[];
		  }
		| {
				target: HTMLElement | undefined;
				mode: 'before';
				node: (Node | null) | (Node | null)[];
				// undefined means append
				before: HTMLElement | number | undefined;
		  }
		| {
				target: HTMLElement | undefined;
				mode: 'replace';
				node: Node | null;
		  };

	export function render(options: Options): number {
		const { mode, node, target } = options;

		if (!node) {
			return 0;
		}

		const nodes = array(node || []).filter(Boolean) as HTMLElement[];

		if (!target) {
			throw new Error('VDOM error: unable to commit operation: target is not defined');
		}

		if (mode === 'after') {
			nodes.reverse().forEach((element) => {
				target.after(element);
			});

			return nodes.length;
		}

		if (mode === 'append') {
			nodes.forEach((element) => {
				target.after(element);
			});

			return nodes.length;
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

			nodes.forEach((element) => {
				target.insertBefore(element, beforeNode as HTMLElement | null);
			});

			return nodes.length;
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
