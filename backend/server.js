const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: '*',
  },
});

app.use(cors());
app.use(express.json());

let messages = [];

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.emit('previousMessages', messages);

  socket.on('sendMessage', (msg) => {
    const message = { text: msg, time: new Date().toLocaleTimeString() };
    messages.push(message);
    io.emit('newMessage', message);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

const PORT = 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
