import { array } from '@v8tenko/utils';

import { VDOM } from '../render/patch';
import { PrimitiveVNode, VNode, VNodeProps, Key } from '../typings/node';
import './setup';

export namespace Node {
	const NOT_RENDER_VALUES = [null, undefined, false, ''] as const;

	export const isPrimitiveVNode = (vNode: VNode): vNode is PrimitiveVNode =>
		vNode !== null && typeof vNode !== 'object';

	export const isVNodeList = (vNode: VNode | VNode[]): vNode is VNode[] => Array.isArray(vNode);
	export const isVNode = (vNode: VNode | VNode[]): vNode is VNode => !isVNodeList(vNode);
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
	export const shouldRenderVNode = (vNode: VNode | VNode[]): boolean => {
		const isVNodeList = Array.isArray(vNode);

		if (isVNodeList) {
			return true;
		}

		return !NOT_RENDER_VALUES.includes(vNode as any);
	};

	export const keys = (vNodeList: VNode[]): (Key | undefined)[] => {
		return vNodeList.map((childVNode) => {
			if (isPrimitiveVNode(childVNode)) {
				return undefined;
			}

			return childVNode?.props.key;
		});
	};

	export const areKeysDifferent = (vNodeList: VNode[]): boolean => {
		return [...new Set(keys(vNodeList))].length === vNodeList.length;
	};

	type CreateVNode = (props: any) => VNode;

	export const createVNode = (
		tagName: string | CreateVNode,
		props: VNodeProps | null = null,
		key: Key | null = null
	) => {
		if (typeof tagName !== 'string') {
			const vNode = tagName(props);

			Object.assign((vNode as any).props, { key });

			return vNode;
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

	const makeNodeFromVNode = (vNode: VNode): Node | null => {
		if (!shouldRenderVNode(vNode)) {
			return null;
		}
		if (isPrimitiveVNode(vNode)) {
			return document.createTextNode(vNode.toString());
		}

		const domNode = document.createElement(vNode!.tagName);

		VDOM.patchProps(domNode, {}, vNode!.props);

		return domNode;
	};

	export const createNode = (vNode: VNode): Node | null => {
		const stack = [{ root: null as Node | null, node: vNode }];
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

			// Used for rendering lists
			const children = array(element!.children!).flat();

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

	export const createNodeList = (vNodeList: VNode | VNode[]): (Node | null)[] => {
		return array(vNodeList).map(createNode);
	};
}
