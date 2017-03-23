var fs = require('fs');
var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var UglifyJSPlugin = require('uglifyjs-webpack-plugin');

// ExtractTextPlugin
var extractSass = new ExtractTextPlugin('m3.css');
var extractCss = new ExtractTextPlugin('ionicons.css');

module.exports = {
    entry: {
        presets: './js/presets.js',
        // main: './js/main.js'
    },
    output: {
        'filename': '[name].js',
        'path': path.resolve(__dirname, 'build'),
        'publicPath': './'
    },
    resolve: {
        modules: ['./', 'node_modules'/*, './js/libs'*/, './js/common', /*'./js/config'*/]
    },

    // devtool: 'source-map',

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
            { 
                test: /assets.*?\.js$/, 
                use: ['file-loader?name=[path][name].[ext]','tojson-loader'] 
            },
            { 
                test: /\.(gif|jpg|png|woff|svg|eot|ttf)\??.*$/, 
                use: 'file-loader?name=[path][name].[ext]'
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: 'babel-loader'
            },
            {
                test: /libs.*\.js$/,
                use: 'script-loader'
            },
        ]
    },
    plugins: [
        new UglifyJSPlugin({comments: false})
    ]
}
