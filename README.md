# AetherDrop — P2P File Sharing over Local Wi-Fi

AetherDrop is a browser-based, peer-to-peer file sharing tool that works over your local Wi-Fi network.  
Files are transferred directly between devices using **WebRTC**, without being uploaded to any server.

## Features
- **Direct P2P transfer** — files never touch a cloud server.
- **Works over LAN/Wi-Fi** — best performance when both devices share the same network.
- **4-digit pairing code** for quick connections.
- **Modern, responsive UI** with dark/light theme toggle.
- **Real-time progress** indicators for sending and receiving.
- **No installation needed** — runs entirely in the browser.

---
### Live Preview
[AetherDrop - click here](https://github.com/CodeWithVedang/AetherDrop)

---
## How It Works
1. **Signaling Server** — Facilitates initial connection setup using WebSockets (`signaling-server.js`).
2. **WebRTC Data Channels** — Once connected, files are sent directly between browsers.
3. **Chunked File Transfer** — Large files are split into chunks (64KB each) for smooth transmission.

---

## Project Structure
```
├── index.html             # Frontend UI and WebRTC logic
├── signaling-server.js    # Node.js WebSocket signaling server
├── package.json           # Server dependencies & scripts
├── icon.png               # App icon
```

---

## Prerequisites
- **Node.js** v16+ (for running the signaling server)
- Modern browser with WebRTC support (Chrome, Edge, Firefox, Safari)

---

## Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/aetherdrop.git
cd aetherdrop
```

### 2. Install Server Dependencies
```bash
npm install
```

### 3. Start the Signaling Server
```bash
npm start
```
This starts the WebSocket signaling server on port `3000` (or `$PORT` from environment variables).

---

## Running the Frontend
You can serve `index.html` from any static hosting provider (e.g., **Vercel**, **Netlify**, or locally via `http-server`):

```bash
npx http-server .
```
Then open [http://localhost:8080](http://localhost:8080) (or your host URL) in two devices connected to the same Wi-Fi.

> **Important:** Update the `SIGNALING_SERVER` URL in `index.html` to point to your running signaling server.

---

## Usage
### Sending a File
1. Click **Send**.
2. Choose a file from your device.
3. Share the **4-digit code** with the receiver.
4. Click **Start sharing**.

### Receiving a File
1. Click **Receive**.
2. Enter the **4-digit code** provided by the sender.
3. Wait for the file to appear, then **Download**.

---

## Deployment
- **Server:** Deploy `signaling-server.js` to any Node.js-compatible host (e.g., Render, Railway, Heroku).
- **Frontend:** Deploy `index.html` and `icon.png` to any static hosting service.

---

## License
MIT License — feel free to modify and share.

---

## Author
Built by [CodeWithVedang](https://github.com/CodeWithVedang)
