const HTMLWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = ({ mode = 'development' }) => ({
	mode,
	entry: path.resolve(__dirname, 'src', 'index.ts'),
	output: {
		path: path.resolve('../', '../', 'dist'),
		filename: 'bundle.js',
		clean: true
	},
	devServer: {
		port: 3000,
		compress: true
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: 'babel-loader'
			},
			{
				test: /\.ts$/,
				use: 'ts-loader',
				exclude: /node_modules/
			}
		]
	},
	resolve: {
		extensions: ['.ts', '.js']
	},
	plugins: [
		new HTMLWebpackPlugin({ filename: 'index.html', template: path.resolve(__dirname, 'public', 'index.html') })
	]
});
