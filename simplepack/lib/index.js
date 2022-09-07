const Compiler = require('./compiler')
const options = require('../simplepack.config')
// 传入配置
new Compiler(options).run();