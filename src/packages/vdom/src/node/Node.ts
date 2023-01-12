import { array, NotNull, Nullable, unique } from '@v8tenko/utils';

import { VDOM } from '../render/patch';
import {
	PrimitiveVNode,
	VNode,
	VNodeProps,
	Key,
	VNodeList,
	VNodeElement,
	VNodeWithChildren,
	Children
} from '../typings/node';

import './setup';

export namespace Node {
	const NOT_RENDER_VALUES = [null, undefined, false, ''] as const;

	export const Fragment = Symbol('vdom/fragment');

	export const isPrimitiveVNode = (vNode: VNodeElement): vNode is PrimitiveVNode =>
		vNode !== null && typeof vNode !== 'object';

	export const isVNodeList = (vNode: VNodeElement): vNode is VNodeList => Array.isArray(vNode);

	export const isVNode = (vNode: VNodeElement): vNode is VNode =>
		vNode !== null && typeof vNode === 'object' && !Array.isArray(vNode) && typeof vNode.tagName === 'string';

	export const hasChildren = (vNode: VNodeElement): vNode is VNodeWithChildren => {
		if (vNode === null) {
			return false;
		}

		if (!isVNode(vNode)) {
			return false;
		}

		if (typeof vNode.children === 'number') {
			return true;
		}

		return Boolean(vNode?.children);
	};

	export const shouldRenderVNode = (vNode: VNodeElement): vNode is NotNull<VNodeElement> => {
		if (isVNodeList(vNode)) {
			return true;
		}

		return !NOT_RENDER_VALUES.includes(vNode as any);
	};

	export const children = (vNode: VNodeWithChildren): Children => {
		const childList = array(vNode.children).filter(shouldRenderVNode);

		if (childList.length === 1) {
			return childList[0];
		}

		return childList as Children;
	};

	export const key = (vNode: VNodeElement): Key | undefined => {
		if (!isVNode(vNode)) {
			return undefined;
		}

		return vNode?.props.key;
	};

	export const keys = (vNodeList: VNodeList): (Key | undefined)[] => {
		return vNodeList.map(key);
	};

	export const validateKey = (key: Key | undefined): boolean => {
		if (key === undefined) {
			return false;
		}

		return true;
	};

	export const areKeysDifferent = (vNodeList: VNodeList): boolean => {
		const renderedVNodes = vNodeList.filter(shouldRenderVNode);

		return unique(keys(renderedVNodes).filter(validateKey)).length === renderedVNodes.length;
	};

	export const mapKeysToVNodes = (vNodeList: VNodeList): Record<Key, VNode> => {
		const vNodeByKeyMap: Record<Key, VNode> = {};

		vNodeList.forEach((vNode) => {
			if (!isVNode(vNode) || !vNode.props.key) {
				return;
			}

			vNodeByKeyMap[vNode?.props.key] = vNode;
		});

		return vNodeByKeyMap;
	};

	type CreateVNode = (props: any) => VNodeElement;

	export const createVNode = (
		tagName: string | CreateVNode | Symbol,
		props: Nullable<VNodeProps>,
		key: Key | null = null
	): VNodeElement => {
		const notNullProps = props || {};

		if (typeof tagName === 'symbol') {
			return props?.children;
		}

		if (typeof tagName === 'function') {
			const vNode = tagName(props);

			if (isVNode(vNode)) {
				Object.assign(vNode.props, { key });
			}

			return vNode;
		}

		Object.assign(notNullProps, { key });

		return {
			tagName,
			props: notNullProps,
			children: props?.children
		} as VNode;
	};

	const makeNodeFromVNode = (vNode: VNodeElement): Node | null => {
		if (!shouldRenderVNode(vNode)) {
			return null;
		}

		if (isPrimitiveVNode(vNode)) {
			return document.createTextNode(vNode.toString());
		}

		if (isVNodeList(vNode)) {
			return document.createDocumentFragment();
		}

		const domNode = document.createElement(vNode.tagName);

		VDOM.patchProps(domNode, {}, vNode!.props);

		return domNode;
	};

	export const createNode = (vNode: VNodeElement): Nullable<Node> => {
		const root = document.createDocumentFragment() as Nullable<Node>;
		const stack = [{ root, node: vNode }];

		while (stack.length) {
			const { node: element, root } = stack.pop()!;

			if (isVNodeList(element)) {
				stack.push(...element.map((el) => ({ root, node: el })).reverse());

				continue;
			}

			const domNode = makeNodeFromVNode(element);

			if (!domNode) {
				continue;
			}

			root?.appendChild(domNode);

			if (!hasChildren(element)) {
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

		return root!;
	};

	export const createNodeList = (vNodeList: VNodeElement): Node => {
		const childNodes = array(vNodeList)
			.filter(shouldRenderVNode)
			.map((vNode) => createNode(vNode));
		const fragment = document.createDocumentFragment();

		childNodes.forEach((child) => child && fragment.appendChild(child));

		return fragment;
	};
}
