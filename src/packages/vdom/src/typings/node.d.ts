export type Children = VNode | (VNode | VNode[])[] | null;
export type Key = string | number;

export type PrimitiveVNode = string | number | boolean;

type SyntheticProps = {
	className?: string;
	value: string | boolean;
	key: Key;
	children: Children;
};

export type VNodeProps = Partial<HTMLElement & SyntheticProps>;
export type VNodeKey = keyof VNodeProps;

export type VNode =
	| {
			tagName: string;
			props: VNodeProps;
			children: Children;
	  }
	| PrimitiveVNode
	| null;
