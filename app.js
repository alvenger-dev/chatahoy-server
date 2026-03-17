const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: process.env.PORT || 10000 });

let relay = null;
let ship = null;

console.log("ChatAHOY server running...");

wss.on('connection', (ws) => {

  ws.on('message', (msg) => {
    const data = JSON.parse(msg);

    console.log("Received:", data);

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
