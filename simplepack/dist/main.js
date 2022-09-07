(function(modules){
            function require(filename){
                var fn = modules[filename]
                var module = { exports: {}}

                // 递归的方式入口文件中的依赖（此时引入的文件会通过require调用到这里）
                fn(require, module, module.exports)
                // 将依赖暴露出去
                return module.exports
            }
            
            // 执行require引入entry中设置的入口文件
            require('/Users/niuweili/Desktop/webpack-project/simplepack/src/index.js')
        })({'/Users/niuweili/Desktop/webpack-project/simplepack/src/index.js': function (require, module, exports) {"use strict";

var _greeting = require("./greeting.js");

document.write((0, _greeting.greeting)('liming'));},'./greeting.js': function (require, module, exports) {"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.greeting = greeting;

function greeting(name) {
  return 'hello' + name;
}},})