const http = require('http');
const { Server } = require('socket.io');
const express = require('express');
const dotenv = require("dotenv").config();
const cors = require("cors");
const conn = require("./config/conn");

const app = express();
const server = http.createServer(app); // use this to run the server
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", 
    methods: ["GET", "POST"]
  }
});

// Database Connection
conn();

// Middleware
app.use(cors());
app.use(express.json());

// Socket.IO logic
const users = {};

// io.on('connection', (socket) => {
//   console.log("User connected:", socket.id);

//   socket.on('join', (userId) => {
//     users[userId] = socket.id;
//     console.log(`User ${userId} joined with socket ${socket.id}`);
//   });

//   socket.on('sendMessage', ({ sender, receiver, message }) => {
//     const receiverSocketId = users[receiver];
//     if (receiverSocketId) {
//       io.to(receiverSocketId).emit('receiveMessage', {
//         sender,
//         message,
//         timestamp: Date.now()
//       });
//     }
//   });

//   socket.on('disconnect', () => {
//     console.log("User disconnected:", socket.id);
//     for (const [uid, sid] of Object.entries(users)) {
//       if (sid === socket.id) {
//         delete users[uid];
//         break;
//       }
//     }
//   });
// });

io.on('connection', (socket) => {
  socket.on('join', (userId) => {
    socket.join(userId); // rooms based on user ID
  });

  socket.on('sendMessage', ({ sender, receiver, message }) => {
    io.to(receiver).emit('receiveMessage', { sender, message, timestamp: Date.now() });
  });
});

// API Routes
app.use('/api/v1', require('./routes/messageRoutes'));
app.use('/api/v1', require('./routes/userRoutes'));
app.use('/api/v1', require('./routes/postRoutes'));

// Start server with Socket.IO
server.listen(4000, () => {
  console.log("Server (with Socket.IO) is running on port 4000");
});




