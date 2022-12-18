import { createNode } from '../node/node';
import { Children, VNode } from '../typings/Node';

function listener(event: any) {
	// @ts-ignore
	return this[event.type](event);
}

// cos we really need it
// eslint-disable-next-line max-params
const patchProp = (domNode: HTMLElement, key: string, oldValue: any, nextValue: any) => {
	if (!nextValue) {
		domNode.removeAttribute(key);

		return;
	}

	if (key.startsWith('on')) {
		const eventName = key.slice(2);

		(domNode as any)[eventName] = nextValue;

		if (!oldValue) {
			domNode.removeEventListener(eventName, listener);
		} else if (!nextValue) {
			domNode.addEventListener(eventName, listener);
		}

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
	const oldChildrenList = Array.isArray(oldChildren) ? oldChildren : [oldChildren!];
	const nextChildrenList = Array.isArray(nextChildren) ? nextChildren : [nextChildren!];

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
