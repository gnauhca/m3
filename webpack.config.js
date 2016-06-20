module.exports = {
	entry: './js/main.js',
	output: {
		'filename': 'index.js',
		'path': './build'
	},
	plugins: [
		new webpack.ProvidePlugin({
		    $: "jquery",
		    jQuery: "jquery",
		    "window.jQuery": "jquery",
		    CONFIG: './js/config.js'
		})
	]
}