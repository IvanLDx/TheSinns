var Server = require('./server');
const Player = require('./server/models/Player');
const Socket = require('./server/Socket');

const World = require('./server/models/World');
const world = new World('3x4');
world.setMap();

var io = require('socket.io')(Server.start(__dirname), {});
io.sockets.on('connection', function (socket) {
	let id = ~~(Math.random() * 8999) + 1000;
	socket.id = id;
	Socket.create(socket);
	Player.connect(socket);

	socket.on('disconnect', function () {
		Socket.delete(socket.id);
		Player.delete(socket.id);
	});
});

setInterval(function () {
	Player.update();
	var pack = {
		player: Player.list,
		touchedTile: World.getTouchedTile()
	};

	Socket.emit(pack);
}, 1000 / Server.FPS);
