import { Node } from '../node/node';
import { VNode } from '../typings/node';

export const mount = (target: HTMLElement, vNode: VNode): HTMLElement => {
	const domNodeRoot = Node.createNode(vNode);

	try {
		target.replaceWith(domNodeRoot!);
	} catch (e) {
		throw new Error('Unable to mount: root is not defined');
	}

	return domNodeRoot as HTMLElement;
};
