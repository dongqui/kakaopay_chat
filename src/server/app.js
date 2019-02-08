const path = require('path');
const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const cors = require('cors');

server.listen(3001, () => {
  console.log('Socket IO server listening on port 3001');
});

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, '../../build')));


io.on('connection', (socket) => {
  const {login, chat, getRooms, joinRoom,
    leaveRoom, getUserOnline, disconnect, invite} = require('./socketEventHandler')(socket, io);

  socket.on('login', login);
  socket.on('chat', chat);
  socket.on('getRooms', getRooms);
  socket.on('joinRoom', joinRoom);
  socket.on('leaveRoom', leaveRoom);
  socket.on('getUserOnline', getUserOnline);
  socket.on('disconnect', disconnect);
  socket.on('invite', invite);
});

module.exports = app;
