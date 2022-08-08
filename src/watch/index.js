import { createApp } from 'vue';
import logo from "../images/logo.png"
import { common } from "../../common";
import './watch.less'
// 创建一个Vue 应用
const hello = {
    data() {
        return {
            count: 1,
        }
    },
    render() {
        return (
            <div>
                <h1 class="count-text">{this.count}</h1>
                <h2 class="common-text">{common()}</h2>
                <img src={logo}></img>
            </div>
        )
    }
}

const app = createApp(hello)

app.mount('#app')


