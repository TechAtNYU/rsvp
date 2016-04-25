var path = require('path');
var webpack = require('webpack');
module.exports = {
    entry: [
        'webpack-dev-server/client?http://0.0.0.0:3000',
        'webpack/hot/only-dev-server',
        './index.js'
    ],
    output: {
        path: __dirname,
        filename: './bundle.js',
    },
    module: {
        loaders: [
            {
                test: /.jsx?$/,
                loaders: ['react-hot', 'babel?presets[]=react,presets[]=es2015'],
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
