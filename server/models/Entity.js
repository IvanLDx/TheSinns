const List = require('./List');
class Entity extends List {
	constructor() {
		super();
		this.x = 40;
		this.y = 40;
		this.w = 10;
		this.h = 10;
	}
	static list = [];
}

module.exports = Entity;
