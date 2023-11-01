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
	static each(evt) {
		this.list.forEach((player, i) => {
			evt(player, i);
		});
	}
	static list = [];
}
