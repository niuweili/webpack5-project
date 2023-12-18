## 开发 webpack plugin

插件没有像 loader 那样单独的开发环境(loader-runner)，只能在 webpack 环境下运行

```
class MyPlugin { // 插件名称
    apply(compiler) { // 插件的apply的方法
        compiler.hooks.done.tap('my plugin', (stats) => { // hooks的钩子函数
            console.log('hello') // 插件的执行语句
        })
    }
}

module.exports = MyPlugin

```

使用

```
plugins: [ new MyPlugin() ]

```

### 插件的错误处理

- 参数校验阶段可以直接 throw 的方式抛出

```
throw new Error('Erorr message')
```

- 通过 compilation 对象的 warnings 和 errors 接收

```
compilation.warnings.push('warnings')
compilation.errors.push('warnings')
```

### 通过 Compilation 进行文件写入

1. 监听 `emit` 的 hooks 获取 compilation 对象
2. 将最终的内容设置到 `compilation.assets` 对象上
3. 使用[webpack-sources](https://github.com/webpack/webpack-sources)做为文件写入
4. 在webpack生成文件时触发emit后会读取 `compilation.assets` 的内容，然后输出到磁盘文件中

所以文件的写入就操作 `compilation.assets` 即可

```
const { RawSource } = require('webpack-sources')
class DemoPlugin {
    constructor(options) {
        this.options = options
    }

    apply(complier) {
        const { name } = this.options
        complier.hooks.emit( (compilation, cb) => {
            compilation.assets[name] = new RawSource('demo')
        })
    }
}
```

#### 插件扩展：编写插件的插件

比如[html-webpack-plugin](https://github.com/jantimon/html-webpack-plugin)

- html-webpack-plugin-alter-chunks (Sync)
- html-webpack-plugin-before-html-generation (Async)
- html-webpack-plugin-alter-asset-tags (Async)
- html-webpack-plugin-after-html-processing (Async)
- html-webpack-plugin-after-emit (Async)
