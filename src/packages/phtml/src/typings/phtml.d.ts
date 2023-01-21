import type { SyntheticProps, VNodeComponent } from '../vdom';

export type CleanupEffect = () => void;
export type Effect = () => void | CleanupEffect;
export type IndexedEffect = {
	effect: Effect;
	id: number;
};
export type Component<Props = {}> = (args: Props & Partial<SyntheticProps>) => VNodeComponent;
