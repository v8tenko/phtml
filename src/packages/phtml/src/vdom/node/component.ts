import { Nullable } from '@v8tenko/utils';

import { VNodeFragment, VNodeComponent, CreateVNode, VNodeProps, Key } from '../typings/node';

import { VNode, VNODE_TYPES } from './common';

export class Component extends VNode<VNodeComponent> {
	type = VNODE_TYPES.COMPONENT;

	private state: VNode<VNodeComponent>;

	constructor(factory: CreateVNode, props: Nullable<VNodeProps>, key: Nullable<Key>) {
		super();

		this.state = factory(props, key);
	}

	container(): HTMLElement {
		if (!this.state) {
			throw new Error('VDOM: unable to mount component before render');
		}

		const element = this.state.container();

		this.state.attach(element);

		return element;
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	patch(next: VNode<VNodeFragment>): void {
		throw new Error('Method not implemented.');
	}

	render(): VNodeComponent {
		const vNode = this.state.render();

		return vNode;
	}

	unmount(): void {
		this.state.unmount();
	}
}
