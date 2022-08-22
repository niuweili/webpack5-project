const path = require('path');
const glob = require('glob');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const webpack = require('webpack');
const HtmlWebpackExternalsPlugin = require('html-webpack-externals-plugin')
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
const BuildErrorPlugin = require("./plugins/buildErrorPlugin.js")
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const SpeedMeasurePlugin = require("speed-measure-webpack-plugin");
const smp = new SpeedMeasurePlugin();

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
                filename: `${pageName}/index.html`,
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

const plugins = [
    // 自动清除打包产物
    new CleanWebpackPlugin(),
    // 开启scope hoisting(mode=production不需要)
    // new webpack.optimize.ModuleConcatenationPlugin(),

    // 优化构建时的命令行
    new FriendlyErrorsWebpackPlugin(),
    // 抛出构建error
    new BuildErrorPlugin(),
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
    // 打包体积分析plugin
    // new BundleAnalyzerPlugin()

    // DLL-引用分包的js
    new webpack.DllReferencePlugin({
        manifest: require('./dll/library.json'),
    })
].concat(htmlWebpackPlugins)

// webpack速度分析插件
// const webpackConfig = smp.wrap({
const webpackConfig = {
    module: {
        rules: [
            {
                test: /\.js$/,
                include: path.resolve('src'),
                use: [
                    // 使用thread-loader进行多进程多实例打包（webpack5提速不太明显）
                    {
                        loader: 'thread-loader',
                        options: {
                            workers: 3
                        },
                    },
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
                // use: [
                //     {
                //         loader: 'file-loader',
                //         options: {
                //             name: '[name]_[hash:8].[ext]'
                //         }
                //     }
                // ],
                type: 'asset/resource',
                generator: {
                    filename: function (chunkData) {
                        const dirName = chunkData.runtime
                        return `${dirName}/img/[name]_[hash:8][ext]`
                    }
                }
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
            // 为了解决使用CssMinimizerPlugin后js文件无法被压缩
            new TerserPlugin({
                parallel: true // 多进程多实例并行压缩
            })
        ],
        splitChunks: {
            minSize: 0, // 被引用的文件大小
            cacheGroups: {
                // 公用模块单独打包
                // TODO: 多页面拆分无法处理文件夹目录
                // commons: {
                //     minChunks: 2, // 引用次数
                //     name: 'commons',
                //     chunks: 'all',
                // },
                // vue资源单独打包到vendors.js中
                // vendors: {
                //     test: /vue/,
                //     name: 'vendors',
                //     chunks: 'all',
                // },
            },
        },
    },
    entry,
    output: {
        publicPath: "../",
        path: path.join(__dirname, 'dist'),
        filename: function (chunkData) {
            const { name, runtime } = chunkData.chunk
            if (runtime.size > 0) {
                return `common/js/${name}_[chunkhash].js`
            }
            return `${name}/js/${name}_[chunkhash].js`
        },
        chunkFilename: function (chunkData) {
            const name = chunkData.chunk.name || chunkData.chunk.id
            const dirName = chunkData.chunk.runtime
            return `${dirName}/js/${name}_[chunkhash].js`
        }
    },
    mode: "production",
    // mode: "development",
    // 构建时只输出error信息
    // stats: 'errors-only',
    plugins,
    // })
}

webpackConfig.plugins.push(
    // 将css提取到单独的文件中
    new MiniCssExtractPlugin({
        filename: function (chunkData) {
            const { name } = chunkData.chunk
            return `${name}/css/${name}_[contenthash].css`
        }
    }),
)

module.exports = webpackConfig