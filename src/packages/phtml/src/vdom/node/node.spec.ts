import { PrimitiveVNode, VNode, VNodeFragment, VNodeList } from '../typings/node';

import { Node } from './node';

describe('node api', () => {
	const vNode: VNode = {
		tagName: 'div',
		children: null,
		props: {}
	};

	const vNodeFragment: VNodeFragment = {
		tagName: Node.Fragment,
		children: null
	};

	const vNodeList: VNodeList = [vNode, vNodeFragment];

	const vNodePrimitive: PrimitiveVNode = 'hello, world';

	const all = [vNode, vNodeFragment, vNodePrimitive, vNodeList];

	test('Node.haveSameTypes method', () => {
		for (let i = 0; i < all.length; i++) {
			for (let j = 0; j < all.length; j++) {
				const [a, b] = [all[i], all[j]];

				expect(Node.haveSameTypes(a, b)).toBe(a === b);
			}
		}
	});
});

export {};
