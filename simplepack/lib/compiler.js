const { getAST, getDependencies, transform } = require('./parser')
const path = require('path')
const fs = require('fs')

module.exports = class Compiler {
    constructor(options) {
        const { entry, output } = options;

        this.entry = entry
        this.output = output

        this.modules = []
    }
    run() {
        // 模块打包后
        const entryModule = this.buildModule(this.entry, true);

        this.modules.push(entryModule)

        // 通过遍历处理引入的依赖
        this.modules.map(_module => {
            _module.depenencies.map(depenency => {
                this.modules.push(this.buildModule(depenency))
            })
        })

        this.emitFiles()
    }
    buildModule(filename, isEntry = false) {
        let ast
        if (isEntry) {
            // 设置的entry
            ast = getAST(filename)
        } else {
            // import的依赖，需要处理下路径
            const absolutePath = path.join(process.cwd(), './src', filename)
            ast = getAST(absolutePath)
        }

        return {
            filename,
            depenencies: getDependencies(ast),
            source: transform(ast)
        }
    }
    // 输出文件
    emitFiles() {
        const outputPath = path.join(this.output.path, this.output.filename)
        let modules = ''

        this.modules.map(_module => {
            // 生成kv形式的数据
            modules += `'${_module.filename}': function (require, module, exports) {${_module.source}},`
        })
        const bundle = `(function(modules){
            function require(filename){
                var fn = modules[filename]
                var module = { exports: {}}

                // 递归的方式入口文件中的依赖（此时引入的文件会通过require调用到这里）
                fn(require, module, module.exports)
                // 将依赖暴露出去
                return module.exports
            }
            
            // 执行require引入entry中设置的入口文件
            require('${this.entry}')
        })({${modules}})`

        fs.writeFileSync(outputPath, bundle, 'utf-8')
    }
}