export type Children = VNodeElement | VNodeElement[] | null;
export type RenderInProgressChildren = Children | VNodeComponentMetadata;
export type Key = string | number;

export type PrimitiveVNode = string | number | boolean;

export type SyntheticProps = {
	className?: string;
	value: string | boolean;
	key: Key;
	children: Children;
};

export type VNodeProps = Partial<HTMLElement & SyntheticProps>;
export type VNodeKey = keyof VNodeProps;

export type VNodeList = VNodeElement[];

export type VNode = {
	tagName: string;
	props: VNodeProps;
	children: Children;
};

export type VNodeFragment = {
	tagName: Symbol;
	children: Children;
};

export type VNodeFactory = (oldComponent: VNodeComponent) => VNodeComponent;

export type CreateVNode = (props: any) => VNodeComponent;
export type CreateVNodeWithSavedProps = () => VNodeComponent;

export type VNodeComponentMetadata = Partial<{
	__id: string;
	__update: VNodeFactory;
	__create: CreateVNodeWithSavedProps;
	__target: HTMLElement;
	__hooksIds: number[];
}>;

export type VNodeComponent = (VNode | VNodeFragment) & VNodeComponentMetadata;
export type VNodeWithoutTag = VNodeFragment | VNodeList;
export type VNodeWithChildren = VNode | VNodeFragment | VNodeList;
export type VNodeElement = VNodeComponent | VNodeList | PrimitiveVNode | undefined | null;
export type RenderInProgressVNode = VNodeElement | VNodeComponentMetadata;
