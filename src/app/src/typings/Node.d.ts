export type VirtualNode = {
	parent?: Node;
	children: Node[];
	render(): string;
};
