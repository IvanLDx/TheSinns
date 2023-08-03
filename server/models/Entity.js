const List = require('./List');
class Entity extends List {
	constructor() {
		super();
		this.x = 40;
		this.y = 40;
		this.w = 10;
		this.h = 10;
		this.spdX = 0;
		this.spdY = 0;
		this.update = () => {
			this.updatePosition();
		};
		this.updatePosition = () => {
			this.x += this.spdX;
			this.y += this.spdY;
		};
	}
	static list = [];
}

module.exports = Entity;
