import { Nullable } from '@v8tenko/utils';

export type Children = Nullable<Nullable<IVNode>[]>;
export type Key = string | number;

export type PrimitiveVNode = string | number | boolean;

export type SyntheticProps = {
	className?: string;
	value: string | boolean;
	key: Key;
	children: Children;
};

export type VNodeProps = Partial<HTMLElement & SyntheticProps>;
export type VNodePropsKey = keyof VNodeProps;
export type VNodePropsValue = VNodeProps[VNodePropsKey];

export type VNodeList = Nullable<IVNode>[];

export type VNodePure = {
	tagName: string;
	props: VNodeProps;
	children: Children;
	category: 'node';
};

export type VNodeFragment = {
	tagName: Symbol;
	children: Children;
	category: 'fragment';
};

export type VNodeChildren = undefined | IVNode | Nullable<IVNode>[];

export type VNodeComponent = VNodePure | VNodeFragment;

export type CreateVNode = (...props: any[]) => IVNode<VNodeComponent>;

export type VNodeElement = VNodePure | VNodeFragment | VNodeList | PrimitiveVNode | undefined | null;

export interface IVNode<Type extends VNodeElement = VNodeElement> {
	id: string;
	target: Nullable<HTMLElement>;
	type: Symbol;

	patch(next: IVNode<Type>): void;

	container(): HTMLElement;
	attach(view: HTMLElement): void;

	render(): Type;
	unmount(): void;
}
