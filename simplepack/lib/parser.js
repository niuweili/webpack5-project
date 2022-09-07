// const babylon = require('babylon');
const parser = require('@babel/parser')
const fs = require('fs');
const traverse = require('@babel/traverse').default;
const { transformFromAst } = require('@babel/core')

module.exports = {
    // 将代码转换为AST
    getAST: (path) => {
        const source = fs.readFileSync(path, 'utf-8')
        // 使用babylon
        // return babylon.parse(source, {
        //     sourceType: 'module'
        // })
        // 使用@babel/parser
        return parser.parse(source, {
            sourceType: 'module'
        });
    },
    // 分析依赖
    getDependencies: (ast) => {
        const dependencies = []
        traverse(ast, {
            // 分析import语句
            ImportDeclaration: ({ node }) => {
                dependencies.push(node.source.value)
            }
        })
        return dependencies
    },
    // 将AST转换为源码
    transform: (ast) => {
        const { code } = transformFromAst(ast, null, {
            presets: ['@babel/env']
        })
        return code
    }
}