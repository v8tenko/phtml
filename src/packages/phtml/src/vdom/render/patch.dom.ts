import { assertNever, Nullable } from '@v8tenko/utils';

import PHTML from '../../phtml/phtml';
import { Node } from '../node/node';
import { VNodeElement, VNodeList, RenderInProgressVNode } from '../typings/node';

export namespace DOM {
	const isDocumentFragment = (node: Node): boolean => node.nodeName === '#document-fragment';

	type RenderOptions =
		| {
				target: Nullable<HTMLElement>;
				mode: 'after' | 'append';
				node: RenderInProgressVNode;
		  }
		| {
				target: Nullable<HTMLElement>;
				mode: 'before';
				node: RenderInProgressVNode;
				// undefined means append
				before: Nullable<HTMLElement | number>;
		  }
		| {
				target: Nullable<HTMLElement>;
				mode: 'replace';
				node: RenderInProgressVNode;
		  };

	type RenderReturn = {
		created: number;
		node: Nullable<Node>;
	};

	export function render(options: RenderOptions): RenderReturn {
		const { mode, node: vNode, target } = options;
		const element = Node.createOrUpdateVNodeComponent(vNode);

		const node = Node.createNode(element);

		if (!node) {
			return { created: 0, node };
		}

		if (Node.isVNodeComponent(element)) {
			element.__target = node as HTMLElement;
			PHTML.attatchComponentToView(element, node as HTMLElement);
		}

		if (!target) {
			throw new Error('VDOM error: unable to commit operation: target is not defined');
		}

		const created = isDocumentFragment(node) ? node.childNodes.length : 1;

		if (mode === 'after') {
			target.after(node);

			return { created, node };
		}

		if (mode === 'append') {
			target.after(node);

			return { created, node };
		}

		if (mode === 'replace') {
			target.replaceWith(node);

			return { created: 0, node };
		}

		if (mode === 'before') {
			const { before } = options;
			let beforeNode: Nullable<HTMLElement>;

			if (typeof before === 'number') {
				beforeNode = target.childNodes.item(before) as Nullable<HTMLElement>;
			} else {
				beforeNode = before;
			}

			target.insertBefore(node, beforeNode as HTMLElement);

			return { created, node };
		}

		assertNever(`No action for mode: ${mode}`);

		return { created: -1, node: null };
	}

	type VNodeListUnmount =
		| {
				mode: 'collection';
				nodes: HTMLElement[];
		  }
		| {
				mode: 'slice';
				root: HTMLElement;
				from: number;
		  };
	type UnmountOptions<T extends VNodeElement> = T extends VNodeList ? VNodeListUnmount : HTMLElement;

	export function unmount<T extends VNodeElement>(vNode: T, ops: UnmountOptions<T>) {
		if (!Node.isVNodeList(vNode)) {
			Node.unmount(ops as HTMLElement, vNode);

			return;
		}

		const options = ops as VNodeListUnmount;

		const { mode } = options;

		let nodes: HTMLElement[] = [];

		if (mode === 'collection') {
			nodes = options.nodes;
		} else {
			const { root, from } = options;
			const childsNodes = Array.from(root.childNodes);

			nodes = childsNodes.slice(from, from + vNode.length) as HTMLElement[];
		}

		let currentChildIndex = 0;

		for (let i = 0; i < vNode.length; i++) {
			if (!Node.shouldRenderVNode(vNode[i])) {
				continue;
			}

			Node.unmount(nodes[currentChildIndex], vNode[i]);

			currentChildIndex++;
		}
	}
}
