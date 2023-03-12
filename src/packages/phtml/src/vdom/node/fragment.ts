import { VNodeFragment, Children } from '../typings/node';

import { VNode, VNODE_TYPES } from './common';

export class Fragment extends VNode<VNodeFragment> {
	children: Children;

	constructor(children: Children) {
		super();
		this.children = children;
	}

	type = VNODE_TYPES.FRAGMENT;

	container(): HTMLElement {
		const element = document.createDocumentFragment();

		this.children?.forEach((node) => node && element.appendChild(node.container()));

		// @todo fix this place
		return element as any;
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	patch(next: VNode<VNodeFragment>): void {
		throw new Error('Method not implemented.');
	}

	render(): VNodeFragment {
		return {
			tagName: VNODE_TYPES.FRAGMENT,
			category: 'fragment',
			children: this.children
		};
	}

	unmount(): void {
		this.children?.forEach((node) => node?.unmount());
	}
}
