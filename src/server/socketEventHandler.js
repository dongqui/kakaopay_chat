let {roomList, onLineUsers} = require('./temporalDB');
module.exports = function (socket, io) {
  return {
    login: function(userId) {
      socket.emit('login', true);
      socket.userId = userId;
      onLineUsers[userId] = {socketId: socket.id};
    },

    getRooms: function() {
      socket.emit('getRooms', roomList)
    },

    joinRoom: function(room) {
      socket.join(room, function() {
        socket.room = room;
        onLineUsers[socket.userId]['room'] = room;
        socket.emit('joinSuccess');
      });
    },

    chat: function({content, imgMessage}) {
      io.in(socket.room).emit('chat', { userId: socket.userId, content, imgMessage });
    },

    leaveRoom: function(room) {
      socket.leave(room, function() {
        socket.room = '';
        onLineUsers[socket.userId].room = '';
      });
    },

    getUserOnline: function() {
      socket.emit('getUserOnline', Object.keys(onLineUsers).filter(user => user !== socket.userId && !onLineUsers[user].room));
    },

    disconnect: function() {
      delete onLineUsers[socket.userId]
    },

    invite: function({selectedUsers, inviteMessage}) {
      let socketIds = selectedUsers.map(userId => onLineUsers[userId].socketId);
      socketIds.forEach(socketId => io.to(socketId).emit('invite', {inviteMessage, userId: socket.userId, room: socket.room}));
    }
  }
};