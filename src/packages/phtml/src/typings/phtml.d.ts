import type { SyntheticProps, VNodeComponent, VNode } from '../vdom';

export type CleanupEffect = () => void;
export type Effect = () => void | CleanupEffect;
export type IndexedEffect = {
	effect: Effect;
	id: number;
};
export type FC<Props = {}> = (args: Props & Partial<SyntheticProps>) => VNode<VNodeComponent>;
export type VirtualDOMTree = VNode;
