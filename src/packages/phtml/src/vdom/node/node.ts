import { array, isNull, NotNull, Nullable, unique, uniqueId } from '@v8tenko/utils';

import PHTML from '../../phtml/phtml';
import { patchProps } from '../render/patch';
import {
	PrimitiveVNode,
	VNode,
	VNodeProps,
	Key,
	VNodeList,
	VNodeElement,
	VNodeWithChildren,
	VNodeFragment,
	VNodeComponent,
	VNodeWithoutTag,
	RenderInProgressVNode,
	CreateVNode,
	VNodeComponentMetadata
} from '../typings/node';

import './setup';

export namespace Node {
	const NOT_RENDER_VALUES = [null, undefined, false, ''] as const;
	const generateId = uniqueId('node');

	export const Fragment = Symbol('vdom/fragment');

	type CreationMode = 'ROOT_ONLY' | 'ALL';
	let mode: CreationMode = 'ALL';

	export const isPrimitiveVNode = (vNode: VNodeElement): vNode is PrimitiveVNode =>
		vNode !== null && typeof vNode !== 'object';

	export const isVNodeList = (vNode: VNodeElement): vNode is VNodeList => Array.isArray(vNode);

	export const isVNode = (vNode: VNodeElement): vNode is VNode =>
		vNode !== null && typeof vNode === 'object' && !Array.isArray(vNode) && typeof vNode.tagName === 'string';

	export const isVNodeFragment = (vNode: VNodeElement): vNode is VNodeFragment =>
		vNode !== null && typeof vNode === 'object' && !Array.isArray(vNode) && typeof vNode.tagName === 'symbol';

	export const isVNodeComponent = (vNode: VNodeElement): vNode is VNodeComponent =>
		(isVNode(vNode) || isVNodeFragment(vNode)) && Object.hasOwn(vNode, '__id');

	export const isVNodeWithoutTag = (vNode: VNodeElement): vNode is VNodeWithoutTag =>
		isVNodeFragment(vNode) || isVNodeList(vNode);

	export const isVNodeFactory = (vNode: RenderInProgressVNode): vNode is VNodeComponentMetadata =>
		typeof vNode === 'object' &&
		Object.keys(vNode || {}).length === 2 &&
		typeof (vNode as any).__update === 'function';

	export const isCreatedVNode = (vNode: RenderInProgressVNode): vNode is VNodeElement => {
		if (isVNodeFactory(vNode)) {
			return false;
		}

		if (isPrimitiveVNode(vNode) || isVNodeList(vNode)) {
			return true;
		}

		return Object.hasOwn(vNode as any, 'tagName');
	};

	export const shouldRenderVNode = (vNode: VNodeElement): vNode is NotNull<VNodeElement> => {
		if (isVNodeList(vNode)) {
			return true;
		}

		return !NOT_RENDER_VALUES.includes(vNode as any);
	};

	export const hasChildren = (vNode: VNodeElement): vNode is VNodeWithChildren => {
		if (vNode === null) {
			return false;
		}

		if (isVNodeList(vNode)) {
			return true;
		}

		if (!isVNode(vNode) && !isVNodeFragment(vNode)) {
			return false;
		}

		if (typeof vNode.children === 'number') {
			return true;
		}

		return shouldRenderVNode(vNode?.children);
	};

	export const haveSameTypes = (a: VNodeElement, b: VNodeElement): boolean => {
		const validators = [isVNode, isVNodeList, isPrimitiveVNode, isVNodeFragment];
		const restuls = validators.map((test) => test(a) || test(b)).filter(Boolean);

		return restuls.length === 1;
	};

	export const children = (vNode: VNodeWithChildren): VNodeElement[] => {
		const childList = isVNodeList(vNode) ? vNode : array(vNode.children);

		return childList;
	};

	export const props = (vNode: VNodeElement): Nullable<VNodeProps> => {
		if (!isVNode(vNode)) {
			return undefined;
		}

		return vNode.props;
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

	export const validateKey = (key: Key | undefined): key is Key => {
		if (key === undefined) {
			return false;
		}

		return true;
	};

	export const areKeysDifferent = (vNodeList: VNodeList): boolean => {
		const renderedVNodes = vNodeList.filter(shouldRenderVNode);

		return unique(keys(renderedVNodes).filter(validateKey)).length === renderedVNodes.length;
	};

	export const mapKeysToVNodes = (vNodeList: VNodeList): Record<Key, VNodeElement> => {
		const vNodeByKeyMap: Record<Key, VNodeElement> = {};

		vNodeList.forEach((vNode) => {
			if (!isVNode(vNode) || isNull(vNode.props.key)) {
				return;
			}

			vNodeByKeyMap[vNode?.props.key] = vNode;
		});

		return vNodeByKeyMap;
	};

	const updateOldComponent =
		(creation: CreateVNode, props: Nullable<VNodeProps>) => (oldComponent: VNodeComponent) => {
			PHTML.componentWillCreate(oldComponent);
			const vNode = creation(props);

			for (const [key, value] of Object.entries(oldComponent || {})) {
				if (key.startsWith('__')) {
					(vNode as any)[key] = value;
				}
			}

			PHTML.componentDidCreate(vNode);

			return vNode;
		};

	const createNewcomponent = (creation: CreateVNode, props: Nullable<VNodeProps>): VNodeComponent => {
		const metadata = {
			__target: undefined,
			__id: generateId.next(),
			__update: updateOldComponent(creation, props),
			__hooksIds: []
		};

		PHTML.componentWillCreate(metadata);
		const vNode = creation(props);

		Object.assign(vNode, metadata);
		PHTML.componentDidCreate(vNode);

		return vNode;
	};

	export const createVNode = (
		tagName: string | CreateVNode | Symbol,
		props: Nullable<VNodeProps> = null,
		key: Nullable<Key> = null
	): RenderInProgressVNode => {
		const notNullProps = props || {};

		if (typeof tagName === 'symbol') {
			return {
				tagName: Fragment,
				children: props?.children
			};
		}

		if (typeof tagName === 'function') {
			const metadata = {
				__target: undefined,
				__id: generateId.next(),
				__update: updateOldComponent(tagName, props),
				__create: () => createNewcomponent(tagName, props),
				__hooksIds: []
			};

			if (mode === 'ROOT_ONLY') {
				return metadata;
			}

			PHTML.componentWillCreate(metadata);
			const vNode = tagName(props);

			Object.assign(vNode, metadata);
			PHTML.componentDidCreate(vNode);

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

	export const createOrUpdateVNodeComponent = (
		componentInProgress: RenderInProgressVNode,
		oldComponent: VNodeElement | undefined = undefined
	): VNodeElement => {
		if (isCreatedVNode(componentInProgress)) {
			return componentInProgress;
		}

		if (isNull(componentInProgress)) {
			return undefined;
		}

		const validatedOldComponent = isVNodeComponent(oldComponent) ? oldComponent : undefined;

		const component = validatedOldComponent
			? componentInProgress.__update!(validatedOldComponent)
			: componentInProgress.__create!();

		const writeTo =
			componentInProgress && typeof componentInProgress === 'object' ? componentInProgress : undefined;

		if (writeTo) {
			Object.assign(writeTo, component);
		}

		return writeTo as VNodeElement;
	};

	export function toggleCreateMode(targetMode: CreationMode) {
		mode = targetMode;
	}

	const makeNodeFromVNode = (vNode: VNodeElement): Nullable<Node> => {
		if (!shouldRenderVNode(vNode)) {
			return null;
		}

		if (isPrimitiveVNode(vNode)) {
			return document.createTextNode(vNode.toString());
		}

		if (isVNodeList(vNode) || isVNodeFragment(vNode)) {
			return document.createDocumentFragment();
		}

		const domNode = document.createElement(vNode.tagName);

		patchProps(domNode, {}, vNode.props);

		return domNode;
	};

	export const createNode = (vNode: VNodeElement): Nullable<Node> => {
		let createdNode: Nullable<Node> = null;
		const stack: { root: Nullable<Node>; node: VNodeElement }[] = [{ node: vNode, root: null }];
		const fragments: { root: Nullable<Element>; fragment: Node; after: Nullable<Element> }[] = [];

		while (stack.length) {
			const { node: element, root } = stack.pop()!;

			const domNode = makeNodeFromVNode(element);

			if (!domNode) {
				continue;
			}

			if (!root) {
				createdNode = domNode;
			}

			if (isVNodeComponent(element)) {
				element.__target = domNode as HTMLElement;
			}

			if (isVNodeWithoutTag(element)) {
				fragments.push({
					root: root as Element,
					fragment: domNode,
					after: root?.lastChild as Nullable<Element>
				});
			} else {
				root?.appendChild(domNode);
			}

			if (!hasChildren(element)) {
				continue;
			}

			// Used for rendering lists
			const children = Node.children(element).flat();

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

		for (let index = fragments.length - 1; index >= 0; index--) {
			const { root, fragment, after } = fragments[index];

			if (after) {
				after.after(fragment);

				continue;
			}

			root?.prepend(fragment);
		}

		return createdNode!;
	};

	export const createNodeList = (vNodeList: VNodeElement): Node => {
		const childNodes = array(vNodeList).map((vNode) => createNode(vNode));
		const fragment = document.createDocumentFragment();

		childNodes.forEach((child) => child && fragment.appendChild(child));

		return fragment;
	};

	export const unmount = (domNode: HTMLElement, vNode: VNodeElement) => {
		if (isVNodeComponent(vNode)) {
			PHTML.componentWillUnmount(vNode);
		}

		domNode.remove();
	};

	export const resetId = () => generateId.reset();
}
