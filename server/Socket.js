const List = require('./models/List');

class Socket extends List {
	constructor() {
		super();
	}

	static emit(pack) {
		Socket.each((socket) => {
			socket.emit('newPosition', pack);
		});
	}
}

module.exports = Socket;
