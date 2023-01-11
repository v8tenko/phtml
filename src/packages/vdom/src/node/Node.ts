import { array, unique } from '@v8tenko/utils';

import { VDOM } from '../render/patch';
import { PrimitiveVNode, VNode, VNodeProps, Key, VNodeList } from '../typings/node';
import './setup';

export namespace Node {
	const NOT_RENDER_VALUES = [null, undefined, false, ''] as const;

	export const isPrimitiveVNode = (vNode: VNode): vNode is PrimitiveVNode =>
		vNode !== null && typeof vNode !== 'object';

	export const isVNodeList = (vNode: VNode | VNodeList): vNode is VNodeList => Array.isArray(vNode);
	export const isVNode = (vNode: VNode | VNodeList): vNode is VNode => !isVNodeList(vNode);
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

	export const shouldRenderVNode = (vNode: VNode | VNodeList): boolean => {
		const isVNodeList = Array.isArray(vNode);

		if (isVNodeList) {
			return true;
		}

		return !NOT_RENDER_VALUES.includes(vNode as any);
	};

	export const key = (vNode: VNode): Key | undefined => {
		if (isPrimitiveVNode(vNode)) {
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
			if (!vNode || isPrimitiveVNode(vNode) || !vNode.props.key) {
				return;
			}

			vNodeByKeyMap[vNode?.props.key] = vNode;
		});

		return vNodeByKeyMap;
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

		const propsWithKey = props || {};

		Object.assign(propsWithKey || {}, { key });

		return {
			tagName,
			props: propsWithKey,
			children: props?.children
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

	export const createNodeList = (vNodeList: VNode | VNodeList): (Node | null)[] => {
		return array(vNodeList).map(createNode);
	};
}
