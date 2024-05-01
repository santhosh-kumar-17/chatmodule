const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const morgan = require('morgan');
const fs = require('fs');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

// Create a write stream to the log file
const accessLogStream = fs.createWriteStream(__dirname + '/access.log', { flags: 'a' });

// Use morgan middleware to log HTTP requests
app.use(morgan('combined', { stream: accessLogStream }));

// Track the number of online users
let onlineUsers = 0;

// Event handler for a connection
io.on('connection', (socket) => {
  console.log('A user connected');
  
  // Increment online user count
  onlineUsers++;

  // Notify all clients about the updated online user count
  io.emit('user count', onlineUsers);

  // Event handler for receiving the username
  let username = '';
  socket.on('username', (name) => {
    username = name;
    // Broadcast the username to all clients
    socket.broadcast.emit('user joined', `${username} has joined the chat.`);
  });

  // Event handler for a custom event (e.g., chat message)
  socket.on('chat message', (msg) => {
    console.log('Message: ' + msg);

    // Get the user IP address
    const userIp = socket.handshake.address;

    // Write the message and user IP to the log file
    const logMessage = `User IP: ${userIp}, Message: ${msg}\n`;
    accessLogStream.write(logMessage);

    // Broadcast the message to all connected clients
    io.emit('chat message', msg);
  });

  // Event handler for disconnection
  socket.on('disconnect', () => {
    console.log('User disconnected');
    
    // Decrement online user count
    onlineUsers--;

    // Notify all clients about the updated online user count
    io.emit('user count', onlineUsers);

    // Notify all clients that a user has left, including the username
    socket.broadcast.emit('user left', `${username} has left the chat.`);
  });
});

// Serve static files
app.use(express.static('public'));

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
});
