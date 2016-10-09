var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

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
            { test: /css\/common\.scss$/, loader: ExtractTextPlugin.extract(['css', 'sass']) },
            { test: /assets.*?\.(png|jpeg|jpg|json)$/, loaders: ['file?name=[path][name].[ext]'] }
        ]
    },

    plugins: [
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery",
            "window.$": "jquery",
            CONFIG: 'config',
            THREE: 'three'
        }),
        new ExtractTextPlugin("common.css")
    ],

    devServer: {
        'content-base': '/',
        'inline': true,
        'port': 9123
    }
}
