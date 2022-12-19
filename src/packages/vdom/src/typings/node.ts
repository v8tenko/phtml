type Children = VNode | VNode[] | undefined;

type VNodeProps = Partial<HTMLElement>;

type VNode =
	| {
			tagName: string;
			props: VNodeProps;
			children: Children;
	  }
	| string;

export type { Children, VNodeProps, VNode };
