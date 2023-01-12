import type { SyntheticProps, VNode } from '@v8tenko/vdom';

export type Cleanup = () => void;
export type Effect = () => void | Cleanup;
export type Component<Props = {}> = (args: Props & Partial<SyntheticProps>) => VNode;
