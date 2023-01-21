import { Node } from './node/node';
import { mount } from './render/mount';
import { patchNode as patch } from './render/patch';

const create = Node.createVNode;

export { create, mount, patch };
export * from './typings/node.d';
