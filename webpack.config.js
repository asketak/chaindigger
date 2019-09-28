const webpack = require('webpack')

module.exports = {
	entry: "./ChainDigger.jsx",
	output: {
		path: __dirname,
		filename: "./bundle.js"
	},
	optimization: {
		minimize: false
	},
	module: {
		rules: [
			{
				test: /\.jsx?$/,
				exclude: /(node_modules|bower_components)/,
				loader: 'babel-loader',
				query: {
					presets: ['@babel/preset-react', '@babel/preset-env'],
					plugins: ['transform-class-properties'],
				}
			}
		]
	},
	plugins: [
		new webpack.DefinePlugin({
			'process.env': {
				NODE_ENV: JSON.stringify('development')
			}
		})
	]
}