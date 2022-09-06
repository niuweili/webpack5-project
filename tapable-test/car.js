const { SyncHook, AsyncSeriesHook } = require('tapable')


class Car {
    constructor() {
        this.hooks = {
            accelerate: new SyncHook(['newspeed']), // 加速
            brake: new SyncHook(), // 刹车
            calculateRoutes: new AsyncSeriesHook(['source', 'target', 'routesList']) // 计算路径
        }
    }

}

const myCar = new Car()

// 绑定同步钩子
myCar.hooks.brake.tap('WaringLampPlugin', () => {
    console.log('WaringLampPlugin')
})

// 绑定同步钩子并传参
myCar.hooks.accelerate.tap('LoggerPlugin', (newSpeed) => {
    console.log('LoggerPlugin', newSpeed)
})

// 绑定异步promise的钩子
myCar.hooks.calculateRoutes.tapPromise('calculateRoutes tapPromise', (source, target, routesList) => {
    console.log('source-->', source)

    return new Promise((resolve, reject) => {
        setTimeout(() => {
            console.log(`tapPromise ${source}${target}${routesList}`)
            resolve()
        }, 1000)
    })
})


myCar.hooks.brake.call()
myCar.hooks.accelerate.call(10)

console.time('cost')

myCar.hooks.calculateRoutes.promise('Async', 'promise', 'demo').then(() => {
    console.timeEnd('cost')
}).catch((err) => {
    console.timeEnd('cost')
    console.err(err)
})