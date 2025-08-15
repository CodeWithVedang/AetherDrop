// signaling-server.js
const WebSocket = require("ws");
const http = require("http");

// Create HTTP server for Render health check
const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("AetherDrop Signaling Server is running");
});

// Create WebSocket server
const wss = new WebSocket.Server({ server });

const rooms = {}; // Store { roomCode: [ws1, ws2] }

wss.on("connection", (ws) => {
  ws.on("message", (message) => {
    try {
      const data = JSON.parse(message);

      if (data.type === "join") {
        const { room } = data;
        if (!rooms[room]) rooms[room] = [];
        rooms[room].push(ws);
        console.log(`User joined room ${room}`);

        // Notify other peer that second user joined
        if (rooms[room].length === 2) {
          rooms[room].forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
              client.send(JSON.stringify({ type: "ready" }));
            }
          });
        }
      }

      // Relay messages between peers in the same room
      if (data.type === "signal") {
        const { room, signal } = data;
        if (rooms[room]) {
          rooms[room].forEach((client) => {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
              client.send(JSON.stringify({ type: "signal", signal }));
            }
          });
        }
      }
    } catch (err) {
      console.error("Error parsing message", err);
    }
  });

  ws.on("close", () => {
    // Remove closed connections from all rooms
    for (const room in rooms) {
      rooms[room] = rooms[room].filter((client) => client !== ws);
      if (rooms[room].length === 0) delete rooms[room];
    }
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Signaling server running on port ${PORT}`);
});
