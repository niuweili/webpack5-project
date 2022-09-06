const Compiler = require("./compiler.js")

class MyPlugin {
    constructor() { }
    apply(compiler) {
        // 绑定同步钩子
        compiler.hooks.brake.tap('WaringLampPlugin', () => {
            console.log('WaringLampPlugin')
        })

        compiler.hooks.accelerate.tap('LoggerPlugin', (newSpeed) => {
            console.log('LoggerPlugin', newSpeed)
        })

        compiler.hooks.calculateRoutes.tapPromise('calculateRoutes tapPromise', (source, target, routesList) => {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    console.log(`tapPromise ${source}${target}${routesList}`)
                    resolve()
                }, 1000)
            })
        })
    }
}

const myPlugin = new MyPlugin()

// webpack config
const options = {
    plugin: [myPlugin]
}

// 模拟webpack执行
const compiler = new Compiler()

if (options.plugin && Array.isArray(options.plugin)) {
    for (const plugin of options.plugin) {
        if (typeof plugin === 'function') {
            plugin.call(compiler, compiler)
        } else {
            plugin.apply(compiler)
        }
    }
}

compiler.run()