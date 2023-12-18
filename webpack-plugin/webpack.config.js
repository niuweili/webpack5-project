const path = require('path')
const DemoPlugin = require('./plugins/demo-plugin')

module.exports = {
    entry: './src/index.js',
    output: {
        path: path.join(__dirname, 'dist'),
        filename: 'main.js'
    },
    mode: 'production',
    plugins: [
        new DemoPlugin({
            name: 'my plugin'
        })
    ]
}