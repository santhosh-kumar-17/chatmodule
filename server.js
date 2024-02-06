// server.js
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

// Event handler for a connection
io.on('connection', (socket) => {
  console.log('A user connected');

  // Event handler for a custom event
  socket.on('chat message', (msg) => {
    console.log('Message: ' + msg);

    // Broadcast the message to all connected clients
    io.emit('chat message', msg);
  });

  // Event handler for disconnection
  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

// Serve static files
app.use(express.static('public'));


const PORT = process.env.PORT || 3000;
server.listen(PORT, '192.168.1.19', () => {
  console.log(`Server is running on http://192.168.1.19:${PORT}`);
});

  
