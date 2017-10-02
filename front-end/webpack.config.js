var path = require('path');
var CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    entry: {
        index: ['./src/js/index.js']
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
        "jQuery": "jQuery"
    },
    plugins: [
        new CopyWebpackPlugin([
            { from: 'src/css', to: 'css' },
            { from: 'src/views', to: 'views' },
        ])
    ]
}