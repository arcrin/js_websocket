let WebsocketServer = require('ws').Server,
    wss = new WebsocketServer({port: 9000})

wss.on('connection', function (socket){
    console.log('client connected')
    socket.on('message', function(message){
        console.log(message)
        socket.send(`From Server: ${message} received`)
    })
    socket.send("Connection received by JS node server")
})