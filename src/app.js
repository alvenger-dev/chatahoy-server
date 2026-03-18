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

    // ✅ TRY JSON PARSE
    try {
      data = JSON.parse(msg);
    } catch {
      data = null;
    }

    console.log('Raw message:', msg.toString());

    // ✅ CASE 1: PLAIN TEXT (Flutter test)
    if (!data) {
      ws.send(JSON.stringify({
        type: "echo",
        message: msg.toString()
     }));
     return;
    }

    console.log('Parsed:', data);

    // ✅ CONNECTION TYPES
    if (data.type === "relay_connect") {
      relay = ws;
      console.log("HomeShip connected");
      return;
    }

    if (data.type === "ship_connect") {
      ship = ws;
      console.log("Ship connected");
      return;
    }

    // ✅ SMS FROM RELAY → SEND TO SHIP
    if (data.type === "sms_received") {
      if (ship) {
        ship.send(JSON.stringify(data));
      }
      return;
    }

    // ✅ SEND SMS FROM APP → RELAY
    if (data.type === "send_sms") {
      if (relay) {
        relay.send(JSON.stringify(data));
      }
      return;
    }
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

// TEST ROUTE
app.get('/', (req, res) => {
  res.send('ChatAHOY server is running');
});

const PORT = process.env.PORT || 10000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
