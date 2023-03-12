import { isNull, Nullable } from '@v8tenko/utils';

import { Children, VNodePropsKey, VNodeProps, VNodePure } from '../typings/node';

import { props, VNode, VNODE_TYPES } from './common';
import { mapJSXPropToHTMLProp } from './syntetic';

export class PureNode extends VNode<VNodePure> {
	tagName: string;
	props: VNodeProps;
	children: Children;

	constructor(tagName: string, props: Nullable<VNodeProps> = null, children: Nullable<Children> = null) {
		super();
		this.tagName = tagName;
		this.props = props || {};
		this.children = children;
	}

	type = VNODE_TYPES.NODE;

	private handleProp<T extends VNodePropsKey>(element: HTMLElement, key: T, value: VNodeProps[T]) {
		/* @todo make more type safety */
		if (key.startsWith('on')) {
			const eventName = key.slice(2);

			element.addEventListener(eventName, value as any);

			return;
		}

		const htmlKey = mapJSXPropToHTMLProp(key);

		if (isNull(htmlKey)) {
			return;
		}

		element.setAttribute(htmlKey, value as any);
	}

	container(): HTMLElement {
		const element = document.createElement(this.tagName);

		props(this).forEach(([key, value]) => {
			this.handleProp(element, key, value);
		});

		this.children?.forEach((node) => create(element, node));

		this.attach(element);

		return element;
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	patch(next: VNode<VNodePure>): void {
		throw new Error('Method not implemented.');
	}

	render(): VNodePure {
		return {
			category: 'node',
			tagName: this.tagName,
			props: this.props,
			children: this.children
		};
	}

	unmount(): void {
		this.target?.remove();
	}
}
