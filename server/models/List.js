class List {
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

	static find(callback) {
		return this.list.find((instance) => {
			return callback(instance);
		});
	}

	static add(instance) {
		this.list.push[instance];
	}

	static findByID(id) {
		return this.list.find((instance) => {
			return (instance.id = id);
		});
	}

	static list = [];
}

module.exports = List;
