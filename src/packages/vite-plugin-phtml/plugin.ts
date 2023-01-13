import { transformSync } from '@babel/core';

const filterFile = (filename: string): boolean => {
	const extension = filename.split('.').pop()!;

	return ['jsx', 'tsx'].includes(extension);
};

const phtmlPlugin = () => ({
	name: 'phtml-plugin',
	transform(code: string, filename: string) {
		if (!filterFile(filename)) {
			return null;
		}

		const result = transformSync(code, {
			filename,
			presets: ['@babel/preset-typescript', ['@babel/preset-env', { modules: false }]],
			plugins: [
				'@babel/plugin-syntax-jsx',
				['@babel/plugin-transform-react-jsx', { runtime: 'automatic', importSource: '@v8tenko/vdom' }]
			]
		});

		if (!result) {
			return null;
		}

		return result.code;
	}
});

export default phtmlPlugin;
