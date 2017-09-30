var path = require('path');
var CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    entry: {
        login: ['./src/js/login.js'],
    },
    output: {
        path: path.join(__dirname, 'dist'),
        filename: "js/[name].js"
    },
    module: {
        loaders: [
            { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader" }
        ]
    },
    externals: {
        "jquery": "jQuery"
    },
    plugins: [
        new CopyWebpackPlugin([
            {from:'src/css',to:'css'},
            {from:'src/views',to:'views'},
        ])
    ]
}