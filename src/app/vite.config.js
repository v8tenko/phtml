import phtmlPlugin from '@v8tenko/vite-plugin-phtml';
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
	// that sucks, @todo replace
	plugins: [phtmlPlugin.default()]
});
