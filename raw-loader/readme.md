通过run-loader调试自己开发的webpack-loader

通过loader-utils获取options传入的参数

> webpack5已删除getOptions, 可以通过`this.qurey`获取

### loader抛出异常
```
// throw Error('Error')
// this.callback(new Error('Error'), json)
```

### loader异步处理
场景：需要执行一段时间的代码（文件的读取->获取文件的值->再去source进行处理）

```
// 异步处理
const asyncCallback = this.async()
// 读取文件
fs.readFile(path.join(__dirname, '../src/async.txt'), 'utf-8', (err, data) => {
    if (err) throw err
    // 返回异步callback
    asyncCallback(null, data)
});callback()
```

### 在loader中使用缓存

- webpack中默认开始loader缓存

```
result--> {
  result: [ 'this async' ],
  resourceBuffer: <Buffer 74 68 69 73 20 69 73 20 74 65 78 74>,
  cacheable: true, // 表示开启了缓存
  fileDependencies: [ '/Users/niuweili/Desktop/webpack-project/raw-loader/src/text.txt' ],
  contextDependencies: []
}

```
> 可以使用this.cacheable(false)关掉缓存

- 缓存条件：loader的结果在相同的输入下有确定的输出

    存在依赖的loader时无法使用缓存


### loader如何进行文件输出（使用webpack运行）
参考[file-loader](https://github.com/webpack-contrib/file-loader/blob/master/src/index.js)

```
// 获取文件中的占位符
const url = loaderUtils.interpolateName(this, options.name, options)

this.emitFile() // 要在webpack环境里才会有
```