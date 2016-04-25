
var path = require('path');
var webpack = require('webpack');
module.exports = {
    entry: './index.js',
    output: {
        path: __dirname,
        filename: './bundle.js',
    },
    module: {
        loaders: [
            {
                test: /.jsx?$/,
                loaders: ['babel?presets[]=react,presets[]=es2015'],
                exclude: /node_modules/
            },
            {
                include: /\.json$/, loaders: ['json-loader']
            }
        ]
    },
    resolve: {
        extensions: ['', '.json', '.jsx', '.js']
    }
};