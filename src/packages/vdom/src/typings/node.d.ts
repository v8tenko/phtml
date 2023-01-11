export type Children = VNode | (VNode | VNodeList)[] | null;
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

export type VNodeList = VNode[];

export type VNode =
	| {
			tagName: string;
			props: VNodeProps;
			children: Children;
	  }
	| PrimitiveVNode
	| null;
