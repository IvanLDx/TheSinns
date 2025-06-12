const Server = require('./server');

global.dirName = __dirname;
global.req = (url) => {
	return require(__dirname + '/server/' + url);
};
global.Log = req('scripts/Log');

const Player = req('models/Player');
const Socket = req('Socket');

var io = require('socket.io')(Server.start(dirName), {});
io.sockets.on('connection', function (socket) {
	Socket.create(socket);

	socket.on('disconnect', function () {
		Socket.delete(socket.id);
		Player.delete(socket.id);
	});
});

setInterval(() => {
	Socket.each((socket) => {
		if (socket.world) {
			socket.requestWorldToSave();
		}
	});
}, 20000);
