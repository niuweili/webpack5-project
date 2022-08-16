global.self = global;

const fs = require("fs")
const path = require("path")
const express = require('express')
const { renderToString } = require('vue/server-renderer')
const { createApp } = require('../dist/js/server.js');
// import { createApp }from '../dist/js/server.js';
// const template = fs.readFileSync(path.join(__dirname, '../dist/watch/index.html'), 'utf-8')
const template = fs.readFileSync(path.join(__dirname, '../dist/watch.html'), 'utf-8')
const data = require("./data.json")


const runServer = (port) => {
    const server = express()
    server.get('/watch', (req, res) => {
        const ssr = createApp()

        renderToString(ssr).then((html) => {
            res.status(200).send(renderMarkUp(html))
        })
    })
    // 静态资源处理
    server.use('*', (req, res) => {
        const { baseUrl } = req
        const sendFile = path.join(__dirname, `../dist/${baseUrl}`)
        fs.access(sendFile, fs.constants.R_OK, err => {
            if (err) {
                console.error('no match', sendFile);
                res.status(404).send('no match');
            } else {
                res.sendFile(sendFile)
            }
        });
    })

    server.listen(port, () => {
        console.log('server is running on port:', port)
    })

}

const renderMarkUp = (str) => {
    const dataStr = JSON.stringify(data)
    return template.replace('<!-- HTML_PLACEHOLDER -->', str)
        .replace('<!-- INITIAL_DATA_PLACEHOLDER -->', `<script>window.initial_data=${dataStr}<script>`)
    // .replace('<!-- SRCIPT_CLIENT -->', `<script src='./dist/js/client-server.js'><script>`)
}

runServer(process.env.PORT || 3001)




