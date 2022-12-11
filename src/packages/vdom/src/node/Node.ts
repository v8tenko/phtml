export const node = (tag: string, attributes: Partial<HTMLElement>) => {
	const element = document.createElement(tag);

	return element;
};
