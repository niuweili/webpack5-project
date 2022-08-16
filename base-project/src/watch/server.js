import logo from "../images/logo.png"
import { createSSRApp } from 'vue'
import { common } from "../../common";
import './watch.less'
import largeNumber from 'nwl-large-number';
// const largeNumber = require('nwl-large-number')

// 创建一个Vue 应用
export function createApp() {
    return createSSRApp({
        data() {
            return {
                count: 1,
                text: ''
            }
        },
        render() {
            const importClick = () => {
                console.log('import click')
                import("./text").then(text => {
                    this.text = text.default
                })
            }
            const Text = this.text ? this.text : null
            const addResult = largeNumber('999', '1')
            return (
                <div>
                    {addResult}
                    <h1 class="count-text">{this.count}</h1>
                    <h2 class="common-text">{common()}</h2>
                    <img onClick={importClick} src={logo}></img>
                    {this.text ? <Text></Text> : null}
                </div>
            )
        }
    })
}