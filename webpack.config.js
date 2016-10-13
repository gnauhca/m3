var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

// 模型 json 文件作为入口，异步加载
function getModelEntrys() {

}



module.exports = {
    entry: './js/main.js',
    output: {
        'filename': 'index.js',
        'path': './build'
    },
    resolve: {
        root: process.cwd(),
        modulesDirectories: ['node_modules', './js/common', './js/config']
    },

    devtool: 'source-map',

    module: {
        loaders: [
            { test: /css\/common\.scss$/, loader: ExtractTextPlugin.extract(['css', 'sass']) },
            { test: /assets.*?\.(png|jpeg|jpg)$/, loaders: ['file?name=[path][name].[ext]'] },
            {
                test: /js.*?\.js$/,
                exclude: /node_modules/,
                loader: 'babel', 
                query: { presets: ['es2015'] }
            }


        ]
    },

    plugins: [
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery",
            "window.$": "jquery",
            CONFIG: 'config'
        }),
        new ExtractTextPlugin("common.css")
    ],

    devServer: {
        'content-base': '/',
        'inline': true,
        'port': 9123
    }
}
