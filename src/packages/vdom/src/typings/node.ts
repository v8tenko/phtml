type Children = VNode | VNode[] | null;

export type PrimitiveVNode = string | number | boolean;

type VNodeProps = Partial<HTMLElement> & { children?: Children };

type VNode =
	| {
			tagName: string;
			props: VNodeProps;
			children: Children;
	  }
	| PrimitiveVNode
	| null;

export type { Children, VNodeProps, VNode };
