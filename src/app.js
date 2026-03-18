const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 10000 });

console.log("Simple WS server running...");

wss.on('connection', (ws) => {
  console.log("Client connected");

  ws.on('message', (message) => {
    console.log("Received:", message.toString());

    ws.send("Echo: " + message.toString());
  });
});
