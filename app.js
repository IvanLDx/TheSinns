const Server = require('./server');

global.dirName = __dirname;
global.Log = require('./server/scripts/Log');
const Player = require('./server/models/Player');
const Socket = require('./server/Socket');

var io = require('socket.io')(Server.start(dirName), {});
io.sockets.on('connection', function (socket) {
	Socket.create(socket);

	socket.on('disconnect', function () {
		Socket.delete(socket.id);
		Player.delete(socket.id);
	});
});
