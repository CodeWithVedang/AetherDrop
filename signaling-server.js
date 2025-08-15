// signaling-server.js
import { WebSocketServer } from "ws";
import http from "http";

// Simple HTTP server for render health checks / root response
const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("AetherDrop Signaling Server is running");
});

// WebSocket server mounted on the same HTTP server
const wss = new WebSocketServer({ server });

/**
 * rooms: { [roomCode]: Set<WebSocket> }
 * Each room holds up to two clients (sender + receiver).
 */
const rooms = new Map();

wss.on("connection", (ws) => {
  ws.room = null;

  ws.on("message", (msg) => {
    try {
      const data = JSON.parse(msg.toString());
      // join room (both sender and receiver call this with same room/code)
      if (data.type === "join" && data.room) {
        const room = data.room;
        ws.room = room;
        if (!rooms.has(room)) rooms.set(room, new Set());
        rooms.get(room).add(ws);
        console.log(`Client joined room ${room} (count=${rooms.get(room).size})`);

        // notify everyone in room when 2 clients present (ready to exchange offers)
        if (rooms.get(room).size === 2) {
          for (const client of rooms.get(room)) {
            if (client.readyState === client.OPEN) {
              client.send(JSON.stringify({ type: "ready" }));
            }
          }
        }
        return;
      }

      // relay signaling payload to other peer(s) in same room
      if (data.type === "signal" && data.room && data.signal) {
        const set = rooms.get(data.room);
        if (!set) return;
        for (const client of set) {
          if (client !== ws && client.readyState === client.OPEN) {
            client.send(JSON.stringify({ type: "signal", signal: data.signal }));
          }
        }
        return;
      }

    } catch (err) {
      console.error("Invalid message or JSON parse error:", err);
    }
  });

  ws.on("close", () => {
    // remove ws from room if present
    if (ws.room && rooms.has(ws.room)) {
      const set = rooms.get(ws.room);
      set.delete(ws);
      if (set.size === 0) rooms.delete(ws.room);
      else {
        // notify remaining peer that the other left
        for (const other of set) {
          if (other.readyState === other.OPEN) other.send(JSON.stringify({ type: "peer-left" }));
        }
      }
    }
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Signaling server running on port ${PORT}`);
});
