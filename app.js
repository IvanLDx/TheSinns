var Server = require('./server');
const Player = require('./server/models/Player');

var io = require('socket.io')(Server.start(__dirname), {});
io.sockets.on('connection', function (socket) {
	let id = ~~(Math.random() * 8999) + 1000;
	socket.id = id;
	Server.createSocket(socket);
	Player.connect(socket);

	socket.on('disconnect', function () {
		Server.deleteSocket(socket);
		Player.disconnect(socket);
	});
});

setInterval(function () {
	Player.update();
	var pack = {
		player: Player.list
	};

	Server.emit(pack);
}, 1000 / Server.FPS);
