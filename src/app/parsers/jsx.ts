import { assert } from '@v8tenko/utils';

export const html = (template: TemplateStringsArray, ...args: any[]) => {
	if (template.raw.length === 0) {
		return null;
	}

	assert(args.length);
};
