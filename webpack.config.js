const path = require('path'); // include built in node module
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: [
        'babel-polyfill',
        './src/js/index.js'
    ],

    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'js/bundle.js'
    },

    devServer: {
        contentBase: './dist'
    },

    plugins: [
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: './src/index.html'
        })
    ],

    module: {
        rules: [
            {
                test: /\.js$/,   // regular expression to just use babel loader on js files  (regular exp written bw-> "/ /")
                exclude: /node_modules/, // exclude js files of node modules folder 
                use: {
                    loader: 'babel-loader'
                }  
            }
        ]
    }
};