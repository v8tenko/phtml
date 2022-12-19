import { createNode } from '../node/node';
import { VNode } from '../typings/node';

export const mount = (target: HTMLElement, vNode: VNode): HTMLElement => {
	const domNodeRoot = createNode(vNode);

	target.replaceWith(domNodeRoot);

	return domNodeRoot as HTMLElement;
};
