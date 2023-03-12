import { VNODE_TYPES } from './src/vdom/node/common';
import { createVNode } from './src/vdom/node/create';

export const Fragment = VNODE_TYPES.FRAGMENT;
export const jsx = createVNode;
export const jsxs = createVNode;
