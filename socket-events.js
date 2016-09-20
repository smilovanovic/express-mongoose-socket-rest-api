var userModel = require('./models/userModel');
var server = require('./server');

var io = require('socket.io')(server);
io.use(function(socket, next) {
    if (!socket.handshake.query.access_token) return next(new Error('No Access Token Header'));
    userModel.checkToken(socket.handshake.query.access_token).then(function(user) {
        socket.user = user;
        next();
    }, function(err) {
        next(err);
    });
});

io.on('connection', function (socket) {
    console.log('chat socket connected');
});

module.exports = io;

// USAGE IN CONTROLLERS
// req.socket.server.sockets.emit('message', "this is a test"); - io
// req.socket.emit('message', "this is a test"); - socket

// // send to current request socket client
//  socket.emit('message', "this is a test");

//  // sending to all clients, include sender
//  io.sockets.emit('message', "this is a test");

//  // sending to all clients except sender
//  socket.broadcast.emit('message', "this is a test");

//  // sending to all clients in 'game' room(channel) except sender
//  socket.broadcast.to('game').emit('message', 'nice game');

//   // sending to all clients in 'game' room(channel), include sender
//  io.sockets.in('game').emit('message', 'cool game');

//  // sending to individual socketid
//  io.sockets.socket(socketid).emit('message', 'for your eyes only');