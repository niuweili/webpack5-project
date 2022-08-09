
const TerserPlugin = require('terser-webpack-plugin');
module.exports = {
    entry: {
        'large-number': './src/index.js',
        'large-number.min': './src/index.js'
    },
    mode: 'development',
    optimization: {
        minimize: true,
        minimizer: [
            new TerserPlugin({
                include: /\.min\.js$/,
                extractComments: false
            })
        ]
    },
    output: {
        filename: '[name].js',
        library: {
            name: 'largeNumber',
            type: 'umd',
            export: 'default'
        },
    }
}