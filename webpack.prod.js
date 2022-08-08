const path = require('path');
const glob = require('glob');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const webpack = require('webpack');
const HtmlWebpackExternalsPlugin = require('html-webpack-externals-plugin')

// 多页面打包
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
                chunks: [pageName, 'commons'],
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
                    // 'style-loader',
                    MiniCssExtractPlugin.loader,
                    'css-loader'
                ]
            },
            {
                test: /\.less$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    // 'style-loader',
                    'css-loader',
                    'less-loader'
                ]
            },
            {
                test: /\.(png|jpn|gif|jpeg)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            // limit: 10240
                            name: '[name]_[hash:8].[ext]'
                        }
                    }
                ]
            },
            {
                test: /\.(woff|woff2|eot|ttf)$/,
                use: {
                    loader: 'file-loader',
                    options: {
                        // limit: 10240
                        name: '[name]_[hash:8].[ext]'
                    }
                }
            }
        ]
    },
    // devtool: 'source-map', // 是否开启source-map
    optimization: {
        // minimize: false,  // 代码是否会被压缩
        minimizer: [
            // css代码压缩
            new CssMinimizerPlugin(),
            new TerserPlugin() // 为了解决使用CssMinimizerPlugin后js文件无法被压缩
        ],
        splitChunks: {
            minSize: 0, // 被引用的文件大小
            cacheGroups: {
                // 公用模块单独打包
                commons: {
                    minChunks: 2, // 引用次数
                    name: 'commons',
                    chunks: 'all',
                },
                // vue资源单独打包到vendors.js中
                vendors: {
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
        filename: '[name]_[chunkhash:8].js'
    },
    // mode: "production",
    mode: "none",
    plugins: [
        // 自动清除打包产物
        new CleanWebpackPlugin(),
        // 开启scope hoisting(mode=production不需要)
        // new webpack.optimize.ModuleConcatenationPlugin(),
        // 将css提取到单独的文件中
        new MiniCssExtractPlugin({
            filename: '[name]_[contenthash:8].css'
        }),
        // 使用vue的cdn资源
        // new HtmlWebpackExternalsPlugin({
        //     externals: [
        //         {
        //             module: 'vue',
        //             entry: 'https://unpkg.com/vue@3.2.36/dist/vue.global.js',
        //             global: 'Vue'
        //         },
        //     ],
        // })
    ].concat(htmlWebpackPlugins),
}