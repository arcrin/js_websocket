const http = require('http')
const WebSocketServer = require('websocket').server

const server = http.createServer()
server.listen(9000)

const wsServer = new WebSocketServer({
    httpServer: server
})

wsServer.on('request', function(request){
    const connection = request.accept(null, request.origin);
    connection.on('message', function(message){
        console.log(typeof message)
        console.log('Received Message:', message.utf8Data);
        connection.sendUTF('Hi this is Websocket server!')
    })
    connection.on('close', function(reasonCode, description){
        console.log('Client has disconnected.')
    })
})