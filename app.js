const Server = require('./server');

global.dirName = __dirname;
const Player = require('./server/models/Player');
const Socket = require('./server/Socket');

const World = require('./server/models/World');
const world = new World('4x8');
world.setMap();
world.openMap();

var io = require('socket.io')(Server.start(dirName), {});
io.sockets.on('connection', function (socket) {
	Socket.create(socket);

	socket.on('disconnect', function () {
		Socket.delete(socket.id);
		Player.delete(socket.id);
	});
});
