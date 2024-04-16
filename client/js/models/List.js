export class List {
	static delete(id) {
		this.list.forEach((element, i) => {
			if (element.id === id) {
				this.list.splice(i, 1);
			}
		});
	}
	static push(socket) {
		this.list.push(socket);
	}
	static each(callback) {
		this.list.forEach((player, i) => {
			callback(player, i);
		});
	}
	static sort(callback) {
		this.list.sort((a, b) => {
			return callback(a, b);
		});
	}
	static list = [];
}
