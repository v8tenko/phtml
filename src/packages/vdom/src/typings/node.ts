type Children = VNode | VNode[] | null;

export type PrimitiveVNode = string | number | boolean;

type SyntheticProps = {
	value: string | boolean;
	children: Children;
};

type VNodeProps = Partial<HTMLElement & SyntheticProps>;

type VNode =
	| {
			tagName: string;
			props: VNodeProps;
			children: Children;
	  }
	| PrimitiveVNode
	| null;

export type { Children, VNodeProps, VNode };
