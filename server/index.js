var express = require('express');
var app = express();
var serv = require('http').Server(app);

const Server = {
	start(dir) {
		console.info(dir);
		app.get('/', function (req, res) {
			res.sendFile(dir + '/client/index.html');
		});

		app.use('/client', express.static(dir + '/client'));

		serv.listen(3000);

		return serv;
	}
};

module.exports = Server;
