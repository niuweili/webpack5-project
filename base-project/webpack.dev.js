const path = require('path');
const glob = require('glob');
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin');

const seMPA = () => {
    const entry = {}
    const htmlWebpackPlugins = []
    const entryFiles = glob.sync(path.join(__dirname, './src/*/index.js'))

    entryFiles.forEach(item => {
        const pageName = item.match(/src\/(.*)\/index\.js/)[1]

        entry[pageName] = item

        htmlWebpackPlugins.push(
            new HtmlWebpackPlugin({
                template: path.join(__dirname, `./src/${pageName}/index.html`),
                filename: `${pageName}.html`,
                chunks: [pageName],
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
    })

    return {
        entry,
        htmlWebpackPlugins
    }
}

const { entry, htmlWebpackPlugins } = seMPA()

module.exports = {
    // 默认false
    // 某个文件变化后，并不会 立刻告诉监听者，而是先缓存起来，等aggregateTimeout
    // watch: true,
    // watchOptions: {
    //     // 默认为空，不监听的文件或文件夹
    //     ignored: /node_modules/,
    //     // 监听到变化发生后会等300ms再去执行，默认300ms
    //     aggregateTimeout: 300,
    //     // 判断文件是否发生变化是通过不停询问系统指定文件有没有变化实现的，默认每秒问1000次
    //     poll: 1000,
    // },
    module: {
        rules: [
            {
                test: /\.js$/,
                use: [
                    'babel-loader',
                ]
            },
            {
                test: /\.vue$/,
                use: 'vue-loader',
            },
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader'
                ]
            },
            // 这里less与css分开处理，因为css不需要使用到less-loader，可以优化编译的速度
            {
                test: /\.less$/,
                use: [
                    'style-loader',
                    'css-loader',
                    'less-loader'
                ]
            },
            {
                test: /\.(png|jpn|gif|jpeg)$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 10240
                        }
                    }
                ]
            },
            {
                test: /\.(woff|woff2|eot|ttf)$/,
                use: [
                    'file-loader'
                ]
            },
        ]
    },
    optimization: {
        splitChunks: {
            cacheGroups: {
                commons: {
                    test: /vue/,
                    name: 'vendors',
                    chunks: 'all',
                },
            },
        },
    },
    entry,
    output: {
        path: path.join(__dirname, 'dist'),
        filename: '[name].js'
    },
    mode: "development",
    // target: 'web',   
    devServer: {
        allowedHosts: 'all',
        static: {
            directory: path.join(__dirname, 'dist'),
        },
        hot: true   // 开启热更新
    },
    plugins: [
        // 配合webpack-dev-server实现热更新
        new webpack.HotModuleReplacementPlugin()
    ].concat(htmlWebpackPlugins),
}