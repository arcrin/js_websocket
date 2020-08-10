let WebSocket = require('ws')
let ws = new WebSocket("ws://localhost:9000")

ws.onopen = function (e) {
    ws.send("Hello")
}

ws.onmessage = function(e) {
    console.log(e.data)
}