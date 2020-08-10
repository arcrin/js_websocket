let WebSocket = require('ws')
let WebSocketServer = WebSocket.Server,
    wss = new WebSocketServer({port: 9000})
let uuid = require('node-uuid')
let clients = []

function wsBroadcast(type, client_uuid, nickname, message) {
    for(let i = 0; i < clients.length; i++) {
        let clientSocket = clients[i].ws
        if(clientSocket.readyState === WebSocket.OPEN) {
            clientSocket.send(JSON.stringify({
                "type": type,
                "id": client_uuid,
                "nickname": nickname,
                "message": message
            }))
        }
    }
}

let clientIndex = 1

wss.on('connection', function(ws) {
    let client_uuid = uuid.v4()  // server creates a uuid for records. the client doesn't need to know about this info
    let nickname = "AnonymousUser" + clientIndex
    clientIndex += 1
    clients.push({"id": client_uuid, "ws": ws, "nickname": nickname})
    console.log('client [%s] connected', client_uuid)

    let connect_message = nickname + " has connected"
    wsBroadcast("notification", client_uuid, nickname, connect_message)

    ws.on('message', function(message) {
        if(message.indexOf('/nick') === 0) {
            let nickname_array = message.split(' ')
            if(nickname_array.length >= 2){
                let old_nickname = nickname
                nickname = nickname_array[1]
                let nickname_message = "Client " + old_nickname + " changed to " +
                    nickname
                wsBroadcast("nick_update", client_uuid, nickname, nickname_message)
            }
        } else {
            wsBroadcast("message", client_uuid, nickname, message)
        }
    })
    let closeSocket = function(customMessage) {
        for(let i = 0; i < clients.length; i++) {
            if(clients[i].id == client_uuid) {
                let disconnect_message
                if(customMessage) {
                    disconnect_message = customMessage;
                } else {
                    disconnect_message = nickname + " has disconnected"
                }
                wsBroadcast("notificaiton", client_uuid, nickname, disconnect_message)
                clients.splice(i, 1)
            }
        }
    }
    ws.on('close', function() {
        closeSocket()
    })

    process.on('SIGINT', function(){
        console.log("Closing things")
        closeSocket('Server had disconnected')
        process.exit()
    })
})