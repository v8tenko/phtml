import { VNodeProps } from '../typings/node';

const isInput = (domNode: HTMLElement): domNode is HTMLInputElement => domNode.tagName === 'INPUT';

export const configureSpectificProps = (domNode: HTMLElement, props: VNodeProps): void => {
	if (isInput(domNode)) {
		// @ts-ignore wtf? null is default value @todo inspect
		domNode.value = props.value || null;
		domNode.oninput = domNode.onchange;
		domNode.onchange = null;
	}
};
