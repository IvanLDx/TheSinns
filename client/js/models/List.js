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

		return this.list;
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
	static filter(condition) {
		return this.list.filter((item) => {
			return condition(item);
		});
	}
	static find(condition) {
		return this.list.find((item) => {
			return condition(item);
		});
	}
	static getList() {
		return this.list;
	}
	static list = [];
}
