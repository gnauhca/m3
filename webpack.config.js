var webpack = require('webpack');

module.exports = {
	entry: './js/main.js',
	output: {
		'filename': 'index.js',
		'path': './build'
	},
	resolve: {
		modulesDirectories: ['node_modules']
	},

	plugins: [
		new webpack.ProvidePlugin({
		    $: "jquery",
		    jQuery: "jquery",
		    "window.$": "jquery",
		    CONFIG: './config.js'
		})
	]
}