import { Node } from './src/node/Node';

export { mount } from './src/render/mount';

export { VDOM } from './src/render/patch';

export type { VNode, VNodeProps, Children, SyntheticProps } from './src/typings/node';

const isList = Node.isVNodeList;

export { isList };
