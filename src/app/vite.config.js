import { defineConfig } from 'vite';

export default defineConfig({
	build: {
		rollupOptions: {
			input: {
				main: './index.html'
			},
			output: {
				dir: '../../dist',
				format: 'iife'
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
	}
});
