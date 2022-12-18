export type Children = VNode | VNode[] | undefined;

export type VNodeProps = Partial<HTMLElement>;

export type VNode =
	| {
			tagName: string;
			props: VNodeProps;
			children: Children;
	  }
	| string;
