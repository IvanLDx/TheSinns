class List {
	constructor() {}
	static delete(id) {
		this.list.forEach((element, i) => {
			if (element.id === id) {
				this.list.splice(i, 1);
			}
		});
	}
	static create(socket) {
		this.list.push(socket);
	}
	static each(evt) {
		this.list.forEach((player, i) => {
			evt(player, i);
		});
	}
}

module.exports = List;
