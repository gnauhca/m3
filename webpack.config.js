var webpack = require('webpack');

module.exports = {
	entry: './js/main.js',
	output: {
		'filename': 'index.js',
		'path': './build'
	},
	resolve: {
		root: process.cwd(),
		modulesDirectories: ['node_modules', './js/common']
	},

	devtool: 'source-map',

    module: {
        loaders: [
            { test: /css.*?\.scss$/, loaders: ['style', "css", "sass"] },
            { test: /assets.*?\.(png|jpeg|jpg|json)$/, loaders: ['file?name=[path][name].[ext]']}
        ]
    },

	plugins: [
		new webpack.ProvidePlugin({
		    $: "jquery",
		    jQuery: "jquery",
		    "window.$": "jquery",
		    CONFIG: 'config',
		    THREE: 'three'
		})
	]
}