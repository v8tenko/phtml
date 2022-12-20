import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
	build: {
		rollupOptions: {
			input: {
				main: './index.html'
			},
			output: {
				dir: 'dist',
				format: 'es'
			}
		},
		emptyOutDir: true
	},
	root: './',
	server: {
		port: 3000
	},
	json: {
		stringify: true
	},
	plugins: [
		react({
			jsxRuntime: 'automatic',
			jsxImportSource: '@v8tenko/vdom',
			babel: {
				include: '**/*.tsx',
				babelrc: true
			}
		})
	]
});
