import { createVNode } from './node/create';
import { mount } from './render/mount';

const create = createVNode;

export { create, mount };
export * from './typings/node';
