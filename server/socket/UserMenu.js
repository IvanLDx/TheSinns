class UserMenu {
	constructor(socket) {
		this.id = socket.id;
		this.socket = socket;
	}

	initEvents() {
		this.socket.on('enterWorld', (data) => {
			this.socket.emit('enterWorld-OK', {});
		});
	}
}

module.exports = UserMenu;
