## large-number大整数加法

[打包npm包（nwl-large-number）](https://www.npmjs.com/package/nwl-large-number)


引入方式

- ES module引入
```
import largeNumber from 'nwl-large-number';

const addResult = largeNumber('999', '1') // 1000
```

- CJS引入
```
const largeNumber = require('nwl-large-number')
const addResult = largeNumber('999', '1')  // 1000
```

- AMD引入
```
 require(['nwl-large-number'],function(largeNumber){
    const addResult = largeNumber('999', '1')
    console.log(addResult)  // 1000
})
```

- dist中包含未压缩(large-number.js)和压缩(large-number.min.js)后的代码

- production环境使用压缩(large-number.min.js)代码，其它环境使用未压缩(large-number.js)代码

```
if (process.env.NODE_ENV === 'production') {
    module.exports = require('./dist/large-number.min.js')
} else {
    module.exports = require('./dist/large-number.js')
}
```
