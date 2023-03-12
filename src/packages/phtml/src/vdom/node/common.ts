import { NotNull, Nullable, uniqueId } from '@v8tenko/utils';

import { IVNode, VNodeElement, VNodeProps, VNodePropsKey, VNodePropsValue } from '../typings/node';

export const VNODE_TYPES = {
	FRAGMENT: Symbol('vdom/fragment'),
	PRIMITIVE: Symbol('vdom/primitive'),
	NODE: Symbol('vdom/node'),
	LIST: Symbol('vdom/list'),
	COMPONENT: Symbol('vdom/component')
} as const;

export type VNodeType = keyof typeof VNODE_TYPES;

const id = uniqueId('vnode');

export const nextId = () => id.next();

export abstract class VNode<Type extends VNodeElement = VNodeElement> implements IVNode<Type> {
	id: string;
	target: Nullable<HTMLElement> = null;

	private static NOT_RENDER = [null, undefined, false, ''] as const;
	static shouldRender = (vNode: Nullable<VNode>): vNode is NotNull<VNode> => !this.NOT_RENDER.includes(vNode as any);

	abstract type: Symbol;
	abstract patch(next: VNode<Type>): void;
	abstract container(): HTMLElement;
	abstract render(): Type;
	abstract unmount(): void;

	attach(view: HTMLElement) {
		this.target = view;
	}

	constructor() {
		this.id = id.next();
	}
}

export const props = <Node extends { props: VNodeProps }>(vNode: Node): [VNodePropsKey, VNodePropsValue][] => {
	return Object.entries(vNode.props) as [VNodePropsKey, VNodePropsValue][];
};
