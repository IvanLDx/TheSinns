const List = require('./List');
class Player extends List {
	constructor(id) {
		super();
		this.x = 40;
		this.y = 40;
		this.w = 10;
		this.h = 10;
		this.id = id;
		this.name = null;
		this.socket = null;

		Player.create(this);
	}

	setName(name) {
		this.name = name;
	}

	static list = [];
}

module.exports = Player;
