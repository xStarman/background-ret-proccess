const WebSocket = require('ws');
 
function onError(ws, err) {
    console.error(`onError: ${err.message}`);
}
 
module.exports = (server) => {
    const wss = new WebSocket.Server({
        server
    });
 
    wss.on('connection', (ws, req) => {
        ws.on('message', data => {
            wss.clients.forEach(function(client) {
                client.send(data.toString());
             });
        });
        ws.on('error', error => onError(ws, error));
        console.log(`onConnection`);
    });
 
    console.log(`App Web Socket Server is running!`);
    return wss;
}