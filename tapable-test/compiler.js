const { SyncHook, AsyncSeriesHook } = require('tapable')

module.exports = class Compiler {
    constructor() {
        this.hooks = {
            accelerate: new SyncHook(['newspeed']), // 加速
            brake: new SyncHook(), // 刹车
            calculateRoutes: new AsyncSeriesHook(['source', 'target', 'routesList']) // 计算路径
        }
    }

    run() {
        this.accelerate(10)
        this.brake()
        this.calculateRoutes('Async', 'promise', 'demo')
    }

    brake() {
        this.hooks.brake.call()
    }

    accelerate(speed) {
        this.hooks.accelerate.call(speed)
    }

    calculateRoutes() {
        this.hooks.calculateRoutes.promise(...arguments).then(() => {
        }).catch((err) => {
            console.err(err)
        })
    }
}