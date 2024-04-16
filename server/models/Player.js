const List = require('./List');
class Player extends List {
	constructor(id) {
		super();
		this.x = 40;
		this.y = 40;
		this.w = 10;
		this.h = 10;
		this.id = id;
		this.socket = null;

		Player.create(this);
	}

	static list = [];
}

module.exports = Player;
