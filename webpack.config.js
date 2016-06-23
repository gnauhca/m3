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

	devtool: 'source-map',

    module: {
        loaders: [
            
            { test: /css.*?\.scss$/, loaders: ["style", "css", "sass"] }
        ]
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