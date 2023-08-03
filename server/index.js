var express = require('express');
var app = express();
var serv = require('http').Server(app);

const Server = {
	start(dir) {
		app.get('/', function (req, res) {
			res.sendFile(dir + '/client/index.html');
		});
		app.use('/client', express.static(dir + '/client'));
		serv.listen(3000);
		return serv;
	},
	deleteSocket(socket) {
		Server.sockets.forEach((serverSocket, i) => {
			if (serverSocket.id === socket.id) {
				Server.sockets.splice(i, 1);
			}
		});
	},
	createSocket(socket) {
		Server.sockets.push(socket);
	},
	emit(pack) {
		Server.sockets.forEach((socket) => {
			socket.emit('newPosition', pack);
		});
	},
	sockets: [],
	FPS: 60
};

module.exports = Server;
