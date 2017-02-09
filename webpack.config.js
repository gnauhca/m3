var fs = require('fs');
var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

var entrys = {};
entrys.main = './js/main.js';
entrys.presets = './js/presets.js';

// ExtractTextPlugin
var extractSass = new ExtractTextPlugin('m3.css');
var extractCss = new ExtractTextPlugin('ionicons.css');

module.exports = {
    entry: entrys,
    output: {
        'filename': '[name].js',
        'path': path.resolve(__dirname, 'build'),
        'publicPath': '/'
    },
    resolve: {
        modules: ['./', 'node_modules'/*, './js/libs'*/, './js/common', /*'./js/config'*/]
    },

    devtool: 'source-map',

    module: {
        rules: [
            { 
                test: /\.scss$/, 
                use: extractSass.extract(['css-loader', 'sass-loader']) 
            },
            { 
                test: /\.css$/, 
                use: extractCss.extract(['css-loader']) 
            },
            /*{ 
                test: /assets.*?\.(png|jpeg|jpg)$/, 
                use: ['file-loader?name=[path][name].[ext]'] 
            },*/
            { 
                test: /assets.*?\.js$/, 
                use: ['file-loader?name=[path][name].[ext]','tojson-loader'] 
            },
            { 
                test: /\.(gif|jpg|png|woff|svg|eot|ttf)\??.*$/, 
                use: 'url-loader?limit=8192&name=[path][name].[ext]'
            },
            {
                test: /libs.*\.js$/,
                use: 'script-loader'
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: 'babel-loader'
            },
        ]
    },

    plugins: [
        new webpack.ProvidePlugin({
            // $: "jquery",
            // jQuery: "jquery",
            // "window.$": "jquery",
            CONFIG: 'config',
            Util: 'util'
        }),
        extractSass,
        extractCss
    ],

    devServer: {
        // 'content-base': '/',
        'inline': true,
        'host': '0.0.0.0',
        'port': 9123
    }
}
