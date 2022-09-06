const { SyncHook, AsyncSeriesHook } = require('tapable')

const hook = new SyncHook(['arg1', 'arg2', 'arg3'])
// 拦截器
hook.intercept({
    // 注册时执行
    register(tap) {
        console.log('hook register', tap);
        return tap;
    },
    // 触发事件时执行
    call(...args) {
        console.log('hook call', args);
    },
    // 在 call 拦截器之后执行
    loop(...args) {
        console.log('hook loop', args);
    },
    // 事件回调调用前执行
    tap(tap) {
        console.log('hook tap', tap);
    },
})
// 绑定同步事件
hook.tap('hook', (arg1, arg2, arg3) => {
    console.log(arg1, arg2, arg3) // ==> 1, 2, 3
})
// 执行同步事件
hook.call(1, 2, 3)


const asyncHook = new AsyncSeriesHook(['name']);

// 绑定异步钩子
asyncHook.tapAsync('asyncHook', (name, callback) => {
    console.log('asyncHook tapAsync', name, callback);
    callback();
});

// 执行异步钩子
asyncHook.callAsync('asyncHook', (data) => {
    console.log('asyncHook callAsync', data);
});