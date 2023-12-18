const { runLoaders } = require('loader-runner');
const path = require('path')
const fs = require('fs')

runLoaders({
    resource: './src/index.css',
    loaders: [
        path.resolve(__dirname, './loaders/sprite-loader.js')
    ],
    readResource: fs.readFile.bind(fs) // 读取资源使用fs
}, (err, result) => {
    err ? console.log('err-->', err) : console.log('result-->', result)
})