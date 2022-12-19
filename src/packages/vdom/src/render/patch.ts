import { array } from '@v8tenko/utils';

import { createNode } from '../node/node';
import { Children, VNode } from '../typings/node';

// cos we really need it
// eslint-disable-next-line max-params
const patchProp = (domNode: HTMLElement, key: string, oldValue: any, nextValue: any) => {
	if (key.startsWith('on')) {
		(domNode as any)[key] = nextValue;

		return;
	}
	if (nextValue === null || nextValue === false) {
		domNode.removeAttribute(key);

		return;
	}

	domNode.setAttribute(key, nextValue);
};

// @todo can we reaaly make it any? or cast to keyof VNodeProps
const patchProps = (domNode: HTMLElement, oldProps: any, nextProps: any) => {
	const allProps = { ...oldProps, ...nextProps };

	Object.keys(allProps).forEach((key) => {
		if (oldProps[key] !== nextProps[key]) {
			patchProp(domNode, key, oldProps[key], nextProps[key]);
		}
	});
};

const patchChildren = (domNode: HTMLElement, oldChildren: Children, nextChildren: Children) => {
	const oldChildrenList = array(oldChildren!);
	const nextChildrenList = array(nextChildren!);

	domNode.childNodes.forEach((child, i) => {
		// eslint-disable-next-line @typescript-eslint/no-use-before-define
		patchNode(child as HTMLElement, oldChildrenList[i], nextChildrenList[i]);
	});

	nextChildrenList.slice(oldChildrenList.length).forEach((vChild) => {
		domNode.appendChild(createNode(vChild));
	});
};

const patchNode = (domNode: HTMLElement, oldVNode: VNode, nextVNode: VNode | undefined): Node | undefined => {
	if (!nextVNode) {
		domNode.remove();

		return undefined;
	}

	if (typeof oldVNode === 'string' || typeof nextVNode === 'string') {
		if (oldVNode !== nextVNode) {
			const nextDomNode = createNode(nextVNode);

			domNode.replaceWith(nextDomNode);

			return nextDomNode;
		}

		return domNode;
	}

	if (oldVNode.tagName !== nextVNode.tagName) {
		const nextDomNode = createNode(nextVNode);

		domNode.replaceWith(nextDomNode);

		return nextDomNode;
	}

	patchProps(domNode, oldVNode.props, nextVNode.props);
	patchChildren(domNode, oldVNode.children, nextVNode.children);

	return domNode;
};

export { patchNode };
