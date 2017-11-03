var http = require('http');
var path = require('path');
var express = require('express');
var app = express();

app.use(express.static(path.join(__dirname, '../src/dist')));

app.get('*', function (req, res, next) {
  res.sendFile(__dirname + "../src/dist/index.html");
});

var users = [
  { id: 0, name: 'Auction master', connected: false },
  { id: 1, name: 'Buyer 1', connected: false },
  { id: 2, name: 'Buyer 2', connected: false },
  { id: 3, name: 'Buyer 3', connected: false },
  { id: 4, name: 'Buyer 4', connected: false },
  { id: 5, name: 'Buyer 5', connected: false }
];

var server = http.createServer(app);
var io = require('socket.io')(server);
io.on('connection', function (socket) {
  console.log('user connected');
  
  socket.on('disconnect', function () {
    console.log('user disconnected');
  });

  socket.emit('msg', { msg: 'Welcome bro!' });

  socket.on('msg', function (msg) {
    socket.emit('msg', { msg: "you sent : " + msg });
  });

  socket.emit('users', users);

  socket.on('connectUser', function (userId) {
    console.log('connectUser received: ' + userId);
    let user = users.find(u => u.id === userId);   
    if (user) {
      user.connected = true;
      socket.join('room' + userId);      
      console.log('joined room');      
      socket.broadcast.emit('userConnected', userId);
    }
  });

  socket.on('disconnectUser', function (userId) {
    console.log('disconnectUser received: ' + userId);    
    let user = users.find(u => u.id === userId);
    if (user) {
      user.connected = false;
      socket.leave('room' + userId);   
      console.log('left room');            
      socket.broadcast.emit('userDisconnected', userId);
    }
  });

  socket.on('requestForJoin', function (data) {
    console.log('requestForJoin received: ' + data);
    socket.broadcast.to('room' + data.userIdToConnect).emit('joinRequested', data);
  });

  socket.on('requestForJoin', function (data) {
    console.log('requestForJoin received: ' + data);
    socket.broadcast.to('room' + data.userIdToConnect).emit('joinRequested', data.userId);
  });
});

server.listen(8988);