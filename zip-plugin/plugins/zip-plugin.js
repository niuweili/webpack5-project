const { RawSource } = require('webpack-sources')
const JSZip = require('jszip')
const path = require('path')

const zip = new JSZip()

class ZipPlugin {
    constructor(options) {
        this.options = options
    }

    apply(complier) {
        // 监听emit文件生成勾子
        complier.hooks.emit.tapAsync('ZipPlugin', (compilation, callback) => {
            const folder = zip.folder(this.options.filename) // 创建zip文件夹
            // 遍历assets文件资源
            for (const filename in compilation.assets) {
                const source = compilation.assets[filename].source() // 获取source
                folder.file(filename, source) // 将source添加到zip文件中
            }
            // 生成zip包
            zip.generateAsync({ type: 'nodebuffer' }).then((content) => {
                // 获取webpack配置的output.path(dist)
                const outputPath = path.join(compilation.options.output.path, this.options.filename + '.zip')
                const outputRelativePath = path.relative(compilation.options.output.path, outputPath) // 改成相对路径
                // 将zip资源添加到assets
                compilation.assets[outputRelativePath] = new RawSource(content)
                callback() // 调用callback完成整个流程
            })
        })
    }
}

module.exports = ZipPlugin