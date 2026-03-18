const http = require('http');

const server = http.createServer();

server.on('upgrade', (req, socket, head) => {
  console.log("Client connected");

  socket.on('data', (data) => {
    console.log("Received:", data.toString());

    // simple echo (raw)
    socket.write(data);
  });
});

server.listen(10000, () => {
  console.log("Simple WS server running on port 10000");
});
