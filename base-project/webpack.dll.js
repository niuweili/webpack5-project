
const path = require('path');
const webpack = require('webpack');

module.exports = {
    entry: {
        library: [
            'vue'
        ]
    },
    mode: "production",
    output: {
        filename: '[name]_[chunkhash].dll.js',
        path: path.join(__dirname, 'dll'),
        library: '[name]_[fullhash]',
    },
    plugins: [
        new webpack.DllPlugin({
            name: '[name]_[fullhash]',
            path: path.join(__dirname, 'dll/[name].json'),
        })
    ]
}