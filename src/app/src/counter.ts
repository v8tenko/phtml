import { useState } from '@v8tenko/phtml';
import { createVNode } from '@v8tenko/vdom';

export const createCounter = () => {
	const [count, setCount] = useState(0);

	return createVNode(
		'div',
		{ className: 'test' },
		createVNode(
			'button',
			{
				onclick: () => setCount(count + 1),
				id: 'button'
			},
			'click'
		),
		createVNode('p', null, `${count}`),
		createVNode('p', null, `i wont change!!`),
		createVNode('p', null, `i wont change!!`),
		createVNode('p', null, `i wont change!!`),
		createVNode('p', null, `i wont change!!`),
		createVNode('p', null, `i will change !${count}!`)
	);
};
