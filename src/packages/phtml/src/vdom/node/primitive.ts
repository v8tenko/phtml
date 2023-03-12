import { PrimitiveVNode } from '../typings/node';

import { VNode, VNODE_TYPES } from './common';

export class Primitive extends VNode<PrimitiveVNode> {
	type = VNODE_TYPES.PRIMITIVE;
	private content: PrimitiveVNode;

	constructor(content: PrimitiveVNode) {
		super();
		this.content = content;
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	patch(next: VNode<PrimitiveVNode>): void {
		throw new Error('Method not implemented.');
	}

	container(): HTMLElement {
		const node = document.createTextNode(this.content.toString()) as any;

		this.attach(node);

		return node;
	}

	render(): PrimitiveVNode {
		return this.content;
	}

	unmount(): void {
		this.target?.remove();
	}
}
