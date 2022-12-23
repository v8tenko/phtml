import { VNodeKey, VNodeProps } from '../typings/node';

type ApplySyntheticProps = (domNode: any, props: Partial<VNodeProps>) => void;
const SYNTHETIC_PROPS: Record<Element['tagName'], ApplySyntheticProps> = {
	INPUT: (domNode: HTMLInputElement, props) => {
		if (props.value) {
			domNode.value = props.value.toString();
		}
		domNode.oninput = domNode.onchange;
		domNode.onchange = null;
	}
};

export const applySyntheticProps = (domNode: HTMLElement, props: Partial<VNodeProps>) => {
	if (domNode.tagName in SYNTHETIC_PROPS) {
		SYNTHETIC_PROPS[domNode.tagName](domNode, props);
	}
};

const JSX_PROPS: Record<string, any> = {
	className: 'class'
};

export const mapJSXPropToHTMLProp = (key: VNodeKey): VNodeKey => {
	if (Object.hasOwn(JSX_PROPS, key)) {
		return JSX_PROPS[key];
	}

	return key;
};
