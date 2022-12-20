import { array } from '@v8tenko/utils';

import { createNode, isPrimitiveVNode, shouldRenderVNode } from '../node/node';
import { configureSpectificProps } from '../node/synthetic';
import { Children, VNode, VNodeProps } from '../typings/node';

const matchJSXPropToHTMLProp = (prop: string): string => {
	if (prop.startsWith('on')) {
		return prop.toLowerCase();
	}

	if (prop === 'className') {
		return 'class';
	}

	return prop;
};

const patchProp = <Key extends keyof VNodeProps>(domNode: HTMLElement, key: Key, nextValue: VNodeProps[Key]) => {
	const domKey = matchJSXPropToHTMLProp(key);

	if (key.startsWith('on')) {
		// @todo wtf? does it ok?
		(domNode as any)[domKey] = nextValue;

		return;
	}
	if (nextValue === null || nextValue === false) {
		domNode.removeAttribute(domKey);

		return;
	}

	domNode.setAttribute(domKey, nextValue as any);
};

// @todo can we reaaly make it any? or cast to keyof VNodeProps
export const patchProps = (domNode: HTMLElement, oldProps: VNodeProps, nextProps: VNodeProps) => {
	const allProps: VNodeProps = { ...oldProps, ...nextProps };

	(Object.keys(allProps) as (keyof VNodeProps)[]).forEach((key) => {
		if (oldProps[key] !== nextProps[key]) {
			patchProp(domNode, key, nextProps[key]);
		}
	});

	configureSpectificProps(domNode, nextProps);
};

const patchChildren = (domNode: HTMLElement, oldChildren: Children, nextChildren: Children) => {
	const oldChildrenList = array(oldChildren!);
	const nextChildrenList = array(nextChildren!);

	let notEmptyIndex = 0;
	const domChildNodes = domNode.childNodes;

	for (let i = 0; i < oldChildrenList.length; i++) {
		const child = domChildNodes[notEmptyIndex];

		if (!shouldRenderVNode(oldChildrenList[i])) {
			const nextChildDomNode = createNode(nextChildrenList[i]);

			if (nextChildDomNode) {
				domNode.insertBefore(nextChildDomNode, child);
				notEmptyIndex++;
			}

			continue;
		}

		if (shouldRenderVNode(nextChildrenList[i])) {
			notEmptyIndex++;
		}

		// eslint-disable-next-line @typescript-eslint/no-use-before-define
		patchNode(child as HTMLElement, oldChildrenList[i], nextChildrenList[i]);
	}

	nextChildrenList.slice(oldChildrenList.length).forEach((vChild) => {
		const domChild = createNode(vChild);

		if (domChild) {
			domNode.appendChild(domChild);
		}
	});
};

const patchNode = (domNode: HTMLElement, oldVNode: VNode, nextVNode: VNode): Node | null => {
	if (!shouldRenderVNode(nextVNode)) {
		domNode.remove();

		return null;
	}

	if (isPrimitiveVNode(oldVNode) || isPrimitiveVNode(nextVNode)) {
		if (oldVNode !== nextVNode) {
			const nextDomNode = createNode(nextVNode);

			domNode.replaceWith(nextDomNode!);

			return nextDomNode;
		}

		return domNode;
	}

	if (oldVNode!.tagName !== nextVNode!.tagName) {
		const nextDomNode = createNode(nextVNode);

		domNode.replaceWith(nextDomNode!);

		return nextDomNode;
	}

	patchProps(domNode, oldVNode!.props, nextVNode!.props);
	patchChildren(domNode, oldVNode!.children, nextVNode!.children);

	return domNode;
};

export { patchNode };
