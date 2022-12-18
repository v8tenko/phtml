import { createVNode, render } from '@v8tenko/vdom';

import { createCounter } from './src/counter';

const createApp = () => {
	return createVNode('div', { className: 'test' }, ['test counter', createCounter()]);
};

const root = document.getElementById('root')!;

render(root, createApp);
