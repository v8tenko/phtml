import { array, assertNever, diff, isNull } from '@v8tenko/utils';

import { Node } from '../node/node';
import { applySyntheticProps, mapJSXPropToHTMLProp } from '../node/synthetic';
import { Children, VNode, VNodeProps, VNodeKey } from '../typings/node';

import { DOM } from './patch.dom';

export namespace VDOM {
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
		oldVNode: VNode | VNode[];
		nextVNode: VNode | VNode[];
		startIndex: number;
		firstListNode: HTMLElement | undefined;
	};

	/**
	 * @returns {number} number of created nodes
	 */
	export function patchLists({ rootNode, oldVNode, nextVNode, startIndex, firstListNode }: PatchListOptions): number {
		const childNodes = new Array(...rootNode.childNodes);

		if (Node.isVNodeList(oldVNode) && Node.isVNodeList(nextVNode)) {
			if (!Node.areKeysDifferent(oldVNode) || !Node.areKeysDifferent(nextVNode)) {
				// eslint-disable-next-line no-console
				console.warn('VDOM warning: Keys are not different, VDOM will not work effectively');
				// eslint-disable-next-line @typescript-eslint/no-use-before-define
				patchChildren({
					domNode: rootNode,
					oldChildren: oldVNode,
					nextChildren: nextVNode,
					createBehavior: { insertAfter: childNodes[startIndex + oldVNode.length - 1] as HTMLElement },
					startIndex
				});

				return nextVNode.length;
			}

			const oldKeys = Node.keys(oldVNode);
			const nextKeys = Node.keys(nextVNode);

			const { added, removed } = diff(oldKeys, nextKeys);

			removed.forEach((index, removedCount) => {
				childNodes[startIndex + index - removedCount].remove();
			});

			added.forEach((index) => {
				DOM.render({
					target: rootNode,
					mode: 'before',
					before: childNodes[startIndex + index] as HTMLElement,
					node: Node.createNode(nextVNode[index])
				});
			});

			return nextVNode.length;
		}

		if (Node.isVNode(oldVNode) && Node.isVNodeList(nextVNode)) {
			const created = DOM.render({
				target: rootNode,
				mode: 'before',
				before: firstListNode,
				node: Node.createNodeList(nextVNode)
			});

			firstListNode?.remove();

			return created;
		}

		if (Node.isVNodeList(oldVNode) && Node.isVNode(nextVNode)) {
			DOM.render({
				target: rootNode,
				mode: 'before',
				before: firstListNode,
				node: Node.createNode(nextVNode)
			});
			DOM.unmount(...(childNodes.slice(startIndex, startIndex + oldVNode.length) as HTMLElement[]));

			return 1;
		}

		assertNever();

		return 0;
	}

	type PatchChildrenOptions = {
		domNode: HTMLElement;
		oldChildren: Children;
		nextChildren: Children;
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
		const oldChildrenList = array(oldChildren);
		const nextChildrenList = array(nextChildren);
		let currentChildIndex = startIndex;

		for (let i = 0; i < oldChildrenList.length; i++) {
			const child = childNodes[currentChildIndex];
			const oldChildVNode = oldChildrenList[i];
			const nextChildVNode = nextChildrenList[i];

			if (!Node.shouldRenderVNode(oldChildVNode)) {
				if (Node.shouldRenderVNode(nextChildVNode)) {
					const childDomNode = Node.createNodeList(nextChildVNode);

					DOM.render({
						target: domNode,
						mode: 'before',
						node: childDomNode,
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
			if (typeof createBehavior === 'string') {
				DOM.render({
					target: domNode,
					mode: createBehavior,
					node: Node.createNodeList(node)
				});

				return;
			}

			DOM.render({
				target: createBehavior.insertAfter,
				mode: 'after',
				node: Node.createNodeList(node)
			});
		});
	}

	export function patchNode(domNode: HTMLElement, oldVNode: VNode, nextVNode: VNode): Node | null {
		if (!Node.shouldRenderVNode(nextVNode)) {
			domNode.remove();

			return null;
		}

		if (isNull(oldVNode)) {
			throw new Error('Virtual DOM: something went wrong.');
		}

		if (Node.isPrimitiveVNode(oldVNode) || Node.isPrimitiveVNode(nextVNode)) {
			if (oldVNode === nextVNode) {
				return domNode;
			}
			const newDomNode = Node.createNode(nextVNode);

			DOM.render({
				target: domNode,
				mode: 'replace',
				node: newDomNode
			});

			return newDomNode;
		}

		if (oldVNode.tagName !== nextVNode!.tagName) {
			const newDomNode = Node.createNode(nextVNode);

			DOM.render({
				target: domNode,
				mode: 'replace',
				node: newDomNode
			});

			return newDomNode;
		}

		patchProps(domNode, oldVNode.props, nextVNode!.props);
		patchChildren({
			domNode,
			oldChildren: oldVNode.children,
			nextChildren: nextVNode!.children
		});

		return domNode;
	}
}
