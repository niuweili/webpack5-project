
class BuildErrorPlugin {
    apply(compiler) {
        compiler.hooks.done.tap('done', function (stats) {
            if (stats.compilation.errors && stats.compilation.errors.length && process.argv.indexOf('--watch') < 0) {
                console.log('build error')
                process.exit(2) // 抛出错误
            }
        })
    }
}
module.exports = BuildErrorPlugin