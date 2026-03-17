const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: process.env.PORT || 10000 });

console.log("ChatAHOY server running...");

wss.on('connection', (ws) => {
  console.log("Client connected");

  ws.on('message', (message) => {
    console.log("Received:", message.toString());

    // AUTO REPLY
    ws.send("Echo: " + message.toString());
  });
});
