var fs = require('fs');
var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

// 模型 json 文件作为入口，异步加载
function getModelEntrys() {
    var base = 'assets/mobiles/';
    var products = fs.readdirSync(base);
    var entrys = {};

    
    products.forEach(function(product) {
        if (/^[^\.]/.test(product))
        entrys[product] = base + product + '/' + product + '.js';
    });
    return entrys;
}
var entrys = {};
// var entrys = getModelEntrys();
entrys.main = './js/main.js';
entrys.presets = './js/presets.js';


// ExtractTextPlugin
var extractLess = new ExtractTextPlugin('[name].css');
var extractCss = new ExtractTextPlugin('[name].css');

module.exports = {
    entry: entrys,
    output: {
        'filename': '[name].js',
        'path': './build',
        'publicPath': '/'
    },
    resolve: {
        root: process.cwd(),
        modules: ['./', 'node_modules'/*, './js/libs'*/, './js/common', /*'./js/config'*/]
    },

    devtool: 'source-map',

    module: {
        rules: [
            { 
                test: /\.scss$/, 
                use: extractLess.extract(['css', 'sass']) 
            },
            { 
                test: /\.css$/, 
                use: extractCss.extract('css', 'sass') 
            },
            { 
                test: /assets.*?\.(png|jpeg|jpg)$/, 
                use: ['file?name=[path][name].[ext]'] 
            },
            { 
                test: /assets.*?\.js$/, 
                use: ['file?name=[path][name].[ext]','tojson'] 
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: 'babel'
            },
            {
                test: /libs.*\.js$/,
                use: 'script'
            }
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
        new ExtractTextPlugin({
            filename: "common.css",
            disable: false,
            allChunks: true
        })
    ],

    devServer: {
        // 'content-base': '/',
        'inline': true,
        'host': '0.0.0.0',
        'port': 9123
    }
}
