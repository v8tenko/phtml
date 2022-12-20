import { array } from '@v8tenko/utils';

import { patchProps } from '../render/patch';
import { PrimitiveVNode, VNode, VNodeProps } from '../typings/node';
import './setup';

const NOT_RENDER_VALUES = [null, undefined, false, ''] as const;

type CreateVNode = () => VNode;

export const createVNode = (tagName: string | CreateVNode, props: VNodeProps | null = null): VNode => {
	if (typeof tagName !== 'string') {
		return tagName();
	}
	const { children } = props || {};

	if (props?.children !== null && props?.children !== undefined) {
		delete props.children;
	}

	return {
		tagName,
		props: props || {},
		children: children !== undefined ? children : null
	};
};

export const isPrimitiveVNode = (vNode: VNode): vNode is PrimitiveVNode => vNode !== null && typeof vNode !== 'object';
export const hasChildren = (vNode: VNode): boolean => {
	if (vNode === null) {
		return false;
	}

	if (isPrimitiveVNode(vNode)) {
		return false;
	}

	if (typeof vNode.children === 'number') {
		return true;
	}

	return Boolean(vNode?.children);
};
export const shouldRenderVNode = (vNode: VNode): boolean => !NOT_RENDER_VALUES.includes(vNode as any);

const makeNodeFromVNode = (vNode: VNode): Node | null => {
	if (!shouldRenderVNode(vNode)) {
		return null;
	}
	if (isPrimitiveVNode(vNode)) {
		return document.createTextNode(vNode.toString());
	}

	const domNode = document.createElement(vNode!.tagName);

	patchProps(domNode, {}, vNode!.props);

	return domNode;
};

export const createNode = (node: VNode): Node | null => {
	const stack = [{ root: null as Node | null, node: node as VNode }];
	let domNodeRoot: Node | undefined;

	while (stack.length) {
		const { node: element, root } = stack.pop()!;
		const domNode = makeNodeFromVNode(element);

		if (!domNode) {
			continue;
		}

		if (!root) {
			domNodeRoot = domNode;
		}

		root?.appendChild(domNode);

		if (isPrimitiveVNode(element) || !hasChildren(element)) {
			continue;
		}

		const children = array(element!.children!);

		for (let index = children.length - 1; index >= 0; index--) {
			if (!shouldRenderVNode(children[index])) {
				continue;
			}

			stack.push({
				root: domNode,
				node: children[index]
			});
		}
	}

	return domNodeRoot!;
};
