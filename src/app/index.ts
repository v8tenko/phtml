import PHTML from '@v8tenko/phtml';
import { createVNode } from '@v8tenko/vdom';

import { createCounter } from './src/counter';

const root = document.getElementById('root');
const app = () => createVNode('div', {}, createCounter(), createCounter(), createCounter());

PHTML.DOM.render(root!, app);
