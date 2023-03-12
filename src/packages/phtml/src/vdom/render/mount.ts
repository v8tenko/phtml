import { FC } from '../../typings/phtml';
import { VNode } from '../node/common';
import { createVNode } from '../node/create';

export const mount = (target: HTMLElement, component: FC): VNode => {
	const root = createVNode(component);

	target.replaceWith(root.container());

	return root;
};
