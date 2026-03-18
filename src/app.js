const express = require('express');
const http = require('http');
const WebSocket = require('ws');

const app = express();
const server = http.createServer(app);

const wss = new WebSocket.Server({ server });

let relay = null;
let ship = null;

console.log("ChatAHOY server running...");

wss.on('connection', (ws) => {
  console.log('Client connected');

  ws.on('message', (msg) => {
    let data;

    try {
      data = JSON.parse(msg);
    } catch {
      data = { type: 'echo', message: msg.toString() };
    }

    console.log('Received:', data);

    // SIMPLE TEST ECHO
    ws.send("Echo: " + msg.toString());

    if (data.type === "relay_connect") {
      relay = ws;
      console.log("HomeShip connected");
    }

    if (data.type === "ship_connect") {
      ship = ws;
      console.log("Ship connected");
    }

    if (data.type === "sms_received") {
      if (ship) {
        ship.send(JSON.stringify(data));
      }
    }

    if (data.type === "send_sms") {
      if (relay) {
        relay.send(JSON.stringify(data));
      }
    }
  });
});

app.get('/', (req, res) => {
  res.send('ChatAHOY server is running');
});

const PORT = process.env.PORT || 10000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
