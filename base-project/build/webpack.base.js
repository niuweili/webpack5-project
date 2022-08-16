const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const TerserPlugin = require("terser-webpack-plugin");
const VueLoaderPlugin = require('vue-loader');


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
                        // return `${dirName}/img/[name]_[hash:8][ext]`
                        return `img/[name]_[hash:8][ext]`
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
        // minimize: true,  // 代码是否会被压缩
        minimizer: [
            // css代码压缩
            // new CssMinimizerPlugin(),
            new TerserPlugin() // 为了解决使用CssMinimizerPlugin后js文件无法被压缩
        ],
    },
    output: {
        publicPath: "/",
        path: path.join(__dirname, '../dist'),
        filename: 'js/[name].js',
    },
    // mode: "production",
    mode: "development",
    plugins: [
        // 自动清除打包产物
        new CleanWebpackPlugin(),
        // 开启scope hoisting(mode=production不需要)
        // new webpack.optimize.ModuleConcatenationPlugin(),
        // 将css提取到单独的文件中
        new MiniCssExtractPlugin({
            filename: 'css/[name]_[contenthash].css'
        }),
    ],
}