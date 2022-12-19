import { array } from '@v8tenko/utils';

import { VNode, VNodeProps } from '../typings/node';
import './setup';

export const createVNode = (tagName: string, props: VNodeProps | null = null, ...children: VNode[]): VNode => {
	return {
		tagName,
		props: props || {},
		children: children.length ? children : undefined
	};
};

const makeNodeFromVNode = (node: VNode): Node => {
	if (typeof node === 'string') {
		return document.createTextNode(node);
	}

	const domNode = document.createElement(node.tagName);

	Object.entries(node.props).forEach(([key, value]) => {
		if (/on.*/.test(key)) {
			(domNode as any)[key] = value;
		} else {
			domNode.setAttribute(key, value as any);
		}
	});

	return domNode;
};

export const createNode = (node: VNode): Node => {
	const stack = [{ root: undefined as Node | undefined, node: node as VNode | string }];
	let domNodeRoot: Node | undefined;

	while (stack.length) {
		const { node: element, root } = stack.pop()!;
		const domNode = makeNodeFromVNode(element);

		if (!root) {
			domNodeRoot = domNode;
		}

		root?.appendChild(domNode);

		if (typeof element === 'string' || !element.children) {
			continue;
		}

		const children = array(element.children);

		for (let index = children.length - 1; index >= 0; index--) {
			stack.push({
				root: domNode,
				node: children[index]
			});
		}
	}

	return domNodeRoot!;
};
