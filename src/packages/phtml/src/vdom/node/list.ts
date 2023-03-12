import { VNodeList } from '../typings/node';

import { VNode, VNODE_TYPES } from './common';
import { create } from './utils';

export class List extends VNode<VNodeList> {
	type = VNODE_TYPES.LIST;
	private elements: VNodeList;

	constructor(elements: VNodeList) {
		super();
		this.elements = elements || [];
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	patch(next: VNode<VNodeList>): void {
		throw new Error('Method not implemented.');
	}

	container(): HTMLElement {
		const element = document.createDocumentFragment();

		// @todo typeeees
		this.elements?.forEach((node) => create(element as any, node));

		// @todo fix this place
		return element as any;
	}

	render(): VNodeList {
		return this.elements;
	}

	unmount(): void {
		this.elements.forEach((node) => {
			node?.unmount();
		});
	}
}
