import { Node } from '../node/node';
import { VNodeElement } from '../typings/node';

export const mount = (target: HTMLElement, vNode: VNodeElement): HTMLElement => {
	const domNodeRoot = Node.createNode(vNode);

	target.appendChild(domNodeRoot!);

	if (Node.isVNodeList(vNode)) {
		return target;
	}

	return domNodeRoot as HTMLElement;
};
