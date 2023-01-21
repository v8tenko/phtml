import { assertNever } from '@v8tenko/utils';

import { Component } from '../../typings/phtml';
import { Node } from '../node/node';
import { VNodeComponent, VNodeElement } from '../typings/node';

export const mount = (target: HTMLElement, component: Component): VNodeComponent => {
	const vNode = Node.createVNode(component) as VNodeElement;
	const domNodeRoot = Node.createNode(vNode);

	Node.toggleCreateMode('ROOT_ONLY');

	target.appendChild(domNodeRoot!);

	if (Node.isVNodeFragment(vNode)) {
		vNode.__target = target;

		return vNode;
	}

	if (Node.isVNodeComponent(vNode)) {
		return vNode;
	}

	assertNever('VDOM error: root of app should always be VNode or VNodeFragment');

	return null as any;
};
