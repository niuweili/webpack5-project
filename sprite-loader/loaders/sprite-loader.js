const Spritesmith = require('spritesmith');
const path = require('path')
const fs = require('fs');
// 入口文件路径
const inputUrl = '../src'
/**
 * 
 * @param {*} css源代码 
 */
module.exports = function (source) {
    // 使用异步callback
    const callback = this.async()
    // 匹配img的url以"?__sprite"为后缀的内容
    const imgs = source.match(/url\((\S*)\?__sprite/g);
    const matchImgs = []
    // 遍历匹配到的内容
    for (let i = 0; i < imgs.length; i++) {
        // 再次做一个匹配
        const img = imgs[i].match(/url\((\S*)\?__sprite/)[1]
        matchImgs.push(path.resolve(__dirname, inputUrl, img))
    }
    // 生成sprite.png
    Spritesmith.run({ src: matchImgs }, (err, result) => {
        fs.writeFileSync(path.join(process.cwd(), 'dist/sprite.png'), result.image)
        // 将代码中的url做替换
        source = source.replace(/url\((\S*)\?__sprite/g, (match) => {
            return `url("dist/sprite.png"`
        })
        // 将css写入dist文件
        fs.writeFileSync(path.join(process.cwd(), 'dist/index.css'), source)

        console.log('source', source)
        // 将结果返回
        callback(null, source)
    })
}
