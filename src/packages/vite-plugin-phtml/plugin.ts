import react from '@vitejs/plugin-react';

export const phtmlPlugin = () => {
	return react({
		babel: {
			include: '**/*.tsx',
			plugins: [
				'@babel/plugin-syntax-jsx',
				['@babel/plugin-transform-react-jsx', { runtime: 'automatic', importSource: '@v8tenko/vdom' }]
			],
			presets: ['@babel/preset-typescript', ['@babel/preset-env', { modules: false }]]
		}
	});
};
