import { createNode } from '../node/node';
import { VNode } from '../typings/Node';

import { patchNode } from './patch';

export let vDomRoot: VNode | undefined;

export type App = () => VNode;

export let patchChanges: (() => void) | undefined;

export const render = (target: HTMLElement, app: App) => {
	vDomRoot = app();
	const domNodeRoot = createNode(vDomRoot);

	target.replaceWith(domNodeRoot);

	let domRoot: HTMLElement = domNodeRoot as HTMLElement;

	patchChanges = () => {
		const nextApp = app();
		const newAppDom = patchNode(domRoot, vDomRoot!, nextApp);

		vDomRoot = nextApp;
		domRoot = newAppDom as HTMLElement;
	};
};
