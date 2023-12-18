const path = require('path')
module.exports = {
    entry: './src/index.js',
    output: {
        path: path.join(__dirname, 'dist'),
        filename: 'main.js'
    },
    module: {
        rules: [
            {
                test: /.js$/,
                use: [
                    {
                        loader: path.resolve('./loaders/file-loader.js'),
                        options: {
                            name: '[name].[ext]'
                        }
                    },
                    {
                        loader: path.resolve('./loaders/raw-loader.js'),
                        options: {
                            name: 'test'
                        }
                    }
                ],
            }
        ]
    }
}