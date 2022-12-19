import { createState, createVNode } from '@v8tenko/vdom';

const state = createState({ counter: 0 });

export const createCounter = () => {
	return createVNode(
		'div',
		{},
		createVNode('button', { onclick: () => (state.counter += 1) }, 'click'),
		createVNode('p', {}, `${state.counter}`)
	);
};
