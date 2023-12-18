const loaderUtils = require('loader-utils');
const fs = require('fs')
const path = require('path')

module.exports = function (source) {
    // 通过loaderUtils获取传入的参数
    // const { name } = loaderUtils.getOptions(this)
    const { name } = this.query

    const json = JSON.stringify(source)
        .replace(/\u2028/g, '\\u2028')
        .replace(/\u2029/g, '\\u2029')
    // es6 字符串安全性问题
    console.log('name', name)
    console.log('source', source)

    // 异步处理
    const asyncCallback = this.async()
    fs.readFile(path.join(__dirname, '../src/async.txt'), 'utf-8', (err, data) => {
        if (err) throw err
        asyncCallback(null, data)
    });
    // 关闭缓存
    this.cacheable(false)
    // 抛出异常
    // throw Error('Error')
    // this.callback(new Error('Error'), json)

    // 回传多个值
    // this.callback(null, json, 1, 2, 3)
    // return `export default ${json}`


}