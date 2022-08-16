const path = require('path');
const glob = require('glob');
const { merge } = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackExternalsPlugin = require('html-webpack-externals-plugin')
const webpackBaseConfig = require('./webpack.base.js')

// 多页面打包
const seMPA = () => {
    const entry = {}
    let htmlWebpackPlugins = []
    const entryFiles = glob.sync(path.join(__dirname, '../src/*/client.js'))

    entryFiles.forEach(item => {
        const pageName = item.match(/src\/(.*)\/client\.js/)[1]
        if (pageName) {
            entry[pageName] = item
            htmlWebpackPlugins.push(
                new HtmlWebpackPlugin({
                    template: path.join(__dirname, `../src/${pageName}/index.html`),
                    filename: `${pageName}.html`,
                    // chunks: [`${pageName}`, 'commons'],
                    chunks: ['client', 'commons'],
                    inject: true,
                    minify: {
                        html5: true,
                        collapseWhitespace: true,
                        preserveLineBreaks: false,
                        minifyCSS: true,
                        minifyJS: true,
                        removeComments: false
                    }
                }),
            )
        }
    })
    return {
        entry,
        htmlWebpackPlugins
    }
}
const { entry, htmlWebpackPlugins } = seMPA()

let plugins = htmlWebpackPlugins

module.exports = merge(webpackBaseConfig, {
    // devtool: 'source-map', // 是否开启source-map
    entry: {
        client: './src/watch/client.js'
    },

    plugins: plugins.concat([]),
})