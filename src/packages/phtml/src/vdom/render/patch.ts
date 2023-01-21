import { array, assertNever, diff, isNull, Nullable } from '@v8tenko/utils';

import { Node } from '../node/node';
import { applySyntheticProps, mapJSXPropToHTMLProp } from '../node/synthetic';
import { Children, VNodeProps, VNodeKey, VNodeElement, RenderInProgressChildren } from '../typings/node';

import { DOM } from './patch.dom';

type ChangedProps<Key extends VNodeKey> = {
	old?: VNodeProps[Key];
	next?: VNodeProps[Key];
};

const handleEventListener = <Key extends VNodeKey>(
	domNode: HTMLElement,
	key: Key,
	{ old, next }: ChangedProps<Key>
) => {
	const eventName = key.toLowerCase().slice(2);

	if (old) {
		domNode.removeEventListener(eventName, old as any);
	}

	if (next) {
		domNode.addEventListener(eventName, next as any);
	}
};

export function patchProp<Key extends VNodeKey>(domNode: HTMLElement, key: Key, props: ChangedProps<Key>) {
	const htmlKey = mapJSXPropToHTMLProp(key);

	if (!htmlKey) {
		return;
	}

	if (htmlKey.startsWith('on')) {
		handleEventListener(domNode, htmlKey, props);

		return;
	}

	if (isNull(props.next)) {
		domNode.removeAttribute(htmlKey);

		return;
	}

	domNode.setAttribute(htmlKey, props.next as any);
}

export function patchProps(domNode: HTMLElement, oldProps: VNodeProps, nextProps: VNodeProps) {
	const allProps: VNodeProps = { ...oldProps, ...nextProps };
	const allKeys = Object.keys(allProps) as VNodeKey[];

	allKeys.forEach((key) => {
		patchProp(domNode, key, { old: oldProps[key], next: nextProps[key] });
	});

	applySyntheticProps(domNode, nextProps);
}

type PatchListOptions = {
	rootNode: HTMLElement;
	oldVNode: VNodeElement;
	nextVNode: VNodeElement;
	startIndex?: number;
	firstListNode?: HTMLElement;
};

/**
 * @returns {number} number of created nodes
 */
export function patchLists({ rootNode, oldVNode, nextVNode, startIndex = 0, firstListNode }: PatchListOptions): number {
	const childNodes = rootNode.childNodes;

	if (Node.isVNodeList(oldVNode) && Node.isVNodeList(nextVNode)) {
		if (!Node.areKeysDifferent(oldVNode) || !Node.areKeysDifferent(nextVNode)) {
			const childNodesCount = oldVNode.filter(Node.shouldRenderVNode).length;

			// eslint-disable-next-line @typescript-eslint/no-use-before-define
			patchChildren({
				domNode: rootNode,
				oldChildren: oldVNode,
				nextChildren: nextVNode,
				createBehavior: { insertAfter: childNodes[startIndex + childNodesCount - 1] as HTMLElement },
				startIndex
			});

			return nextVNode.filter(Node.shouldRenderVNode).length;
		}

		const oldVNodeByKey = Node.mapKeysToVNodes(oldVNode);
		const nextVNodeByKey = Node.mapKeysToVNodes(nextVNode);

		let currentChildIndex = startIndex;

		oldVNode.forEach((vNode) => {
			if (!Node.shouldRenderVNode(vNode)) {
				return;
			}

			const key = Node.key(vNode);

			if (!Node.validateKey(key)) {
				return;
			}

			// eslint-disable-next-line @typescript-eslint/no-use-before-define
			const patchedNode = patchNode(
				childNodes[currentChildIndex] as HTMLElement,
				oldVNodeByKey[key],
				nextVNodeByKey[key]
			);

			if (patchedNode) {
				currentChildIndex++;
			}
		});

		const oldKeys = Node.keys(oldVNode);
		const nextKeys = Node.keys(nextVNode);
		const renderedKeys = nextKeys.filter(Node.validateKey);

		const { added } = diff(oldKeys, nextKeys);

		added.forEach((index) => {
			const childKey = nextKeys[index]!;
			const vNode = nextVNodeByKey[childKey];
			// потому что нужно знать место, где этот элемент необходимо рендерить. @todo можно ли без лишней линии?
			const childIndex = renderedKeys.indexOf(childKey);

			DOM.render({
				target: rootNode,
				mode: 'before',
				before: startIndex + childIndex,
				node: vNode
			});
		});

		return nextVNode.filter(Node.shouldRenderVNode).length;
	}

	if (Node.isVNode(oldVNode) && Node.isVNodeList(nextVNode)) {
		const { created } = DOM.render({
			target: rootNode,
			mode: 'before',
			before: firstListNode,
			node: nextVNode
		});

		if (firstListNode) {
			DOM.unmount(oldVNode, firstListNode);
		}

		return created;
	}

	if (Node.isVNodeList(oldVNode) && Node.isVNode(nextVNode)) {
		DOM.render({
			target: rootNode,
			mode: 'before',
			before: firstListNode,
			node: nextVNode
		});

		DOM.unmount(oldVNode, {
			mode: 'slice',
			root: rootNode,
			from: startIndex
		});

		return 1;
	}

	assertNever();

	return 0;
}

type PatchChildrenOptions = {
	domNode: HTMLElement;
	oldChildren: RenderInProgressChildren;
	nextChildren: RenderInProgressChildren;
	createBehavior?:
		| 'append'
		| {
				insertAfter: HTMLElement;
		  };
	startIndex?: number;
};
export function patchChildren({
	domNode,
	oldChildren,
	nextChildren,
	createBehavior = 'append',
	startIndex = 0
}: PatchChildrenOptions) {
	const childNodes = domNode.childNodes;
	// ts not accepts Function. @todo research why@
	const oldChildrenList = array<Children>(oldChildren as Children);
	const nextChildrenList = array<RenderInProgressChildren>(nextChildren);

	let currentChildIndex = startIndex;

	for (let i = 0; i < oldChildrenList.length; i++) {
		const child = childNodes[currentChildIndex];
		const oldChildVNode = oldChildrenList[i];
		const nextChildrenFactoryOrVNode = nextChildrenList[i];

		const nextChildVNode = Node.createOrUpdateVNodeComponent(nextChildrenFactoryOrVNode, oldChildVNode);

		if (!Node.shouldRenderVNode(oldChildVNode)) {
			if (Node.shouldRenderVNode(nextChildVNode)) {
				DOM.render({
					target: domNode,
					mode: 'before',
					node: nextChildVNode,
					before: child as HTMLElement
				});

				currentChildIndex++;
			}
			continue;
		}

		if (Node.isVNodeList(oldChildVNode) || Node.isVNodeList(nextChildVNode)) {
			currentChildIndex += patchLists({
				rootNode: domNode,
				oldVNode: oldChildVNode,
				nextVNode: nextChildVNode,
				startIndex: currentChildIndex,
				firstListNode: child as HTMLElement
			});

			continue;
		}

		if (Node.shouldRenderVNode(nextChildVNode)) {
			currentChildIndex++;
		}

		// eslint-disable-next-line @typescript-eslint/no-use-before-define
		patchNode(child as HTMLElement, oldChildVNode, nextChildVNode);
	}

	nextChildrenList.slice(oldChildrenList.length).forEach((node) => {
		if (createBehavior === 'append') {
			DOM.render({
				target: domNode,
				mode: createBehavior,
				node
			});

			return;
		}

		DOM.render({
			target: createBehavior.insertAfter,
			mode: 'after',
			node
		});
	});
}

export function patchNode(domNode: HTMLElement, oldVNode: VNodeElement, nextVNode: VNodeElement): Nullable<Node> {
	if (!Node.shouldRenderVNode(nextVNode)) {
		Node.unmount(domNode, oldVNode);

		return null;
	}

	if (isNull(oldVNode)) {
		throw new Error('Virtual DOM: something went wrong.');
	}

	if (Node.isVNodeList(oldVNode) || Node.isVNodeList(nextVNode)) {
		throw new Error('Virtual DOM: something went wrong. patchNode not accepts VNodeLists');
	}

	if (Node.isVNodeFragment(oldVNode) || Node.isVNodeFragment(nextVNode)) {
		if (Node.haveSameTypes(oldVNode, nextVNode)) {
			patchChildren({
				domNode,
				oldChildren: Node.children(oldVNode as any),
				nextChildren: Node.children(nextVNode as any)
			});

			return domNode;
		}

		DOM.render({
			target: domNode,
			mode: 'replace',
			node: nextVNode
		});
	}

	if (Node.isPrimitiveVNode(oldVNode) || Node.isPrimitiveVNode(nextVNode)) {
		if (oldVNode === nextVNode) {
			return domNode;
		}

		const { node } = DOM.render({
			target: domNode,
			mode: 'replace',
			node: nextVNode
		});

		return node;
	}

	if (oldVNode.tagName !== nextVNode!.tagName) {
		const { node } = DOM.render({
			target: domNode,
			mode: 'after',
			node: nextVNode
		});

		DOM.unmount(oldVNode, domNode);

		return node;
	}

	if (Node.isVNode(oldVNode) && Node.isVNode(nextVNode)) {
		patchProps(domNode, oldVNode.props, nextVNode!.props);
	}

	patchChildren({
		domNode,
		oldChildren: oldVNode.children,
		nextChildren: nextVNode!.children
	});

	return domNode;
}
