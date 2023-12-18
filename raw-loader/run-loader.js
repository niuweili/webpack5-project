const { runLoaders } = require('loader-runner');
const fs = require('fs');
const path = require('path');

runLoaders({
    resource: path.join(__dirname, './src/text.txt'),
    // loaders: [path.join(__dirname, './loaders/raw-loader.js')],
    loaders: [
        {
            loader: path.join(__dirname, './loaders/raw-loader.js'),
            // 传入的参数
            options: {
                name: 'test'
            }
        }
    ],
    context: { minimize: true },
    readResource: fs.readFile.bind(fs)
}, (err, result) => {
    err ? console.log('err-->', err) : console.log('result-->', result)
})
