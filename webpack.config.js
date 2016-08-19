var webpack = require('webpack');

module.exports = {
	entry: './js/main.js',
	output: {
		'filename': 'index.js',
		'path': './build'
	},
	resolve: {
		modulesDirectories: ['node_modules', './js/common']
	},

	devtool: 'source-map',

    module: {
        loaders: [
            { test: /css.*?\.scss$/, loaders: ['file?name=common.css', "css", "sass"] }

        ]
    },

	plugins: [
		new webpack.ProvidePlugin({
		    $: "jquery",
		    jQuery: "jquery",
		    "window.$": "jquery",
		    CONFIG: './config.js'
		    THREE: 'js/libs/three.js'
		})
	]
}