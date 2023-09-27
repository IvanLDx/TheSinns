class ServerModalItem {
	constructor({ x, y, w, h, name }) {
		this.x = x || 0;
		this.y = y || 0;
		this.w = w || 20;
		this.h = h || 28;
		this.name = name || 'default';
	}

	static list = [];
}

module.exports = ServerModalItem;
