const { merge } = require('webpack-merge')
const nodeExternals = require('webpack-node-externals');
const clientWebpackConfig = require("./webpack.client.js")

module.exports = merge(clientWebpackConfig, {
    // target: 'node',
    // externals: [nodeExternals({
    //     importType: 'umd'
    // })],
    // devtool: 'source-map', // 是否开启source-map
    entry: {
        server: './src/watch/server.js'
    },
    output: {
        // filename: 'index-server.js',
        library: {
            type: 'umd',
            // export: 'default'
        },
    },
    plugins: [],
})