class ServerModalItem {
	constructor({ x, y, w, h, url, name }) {
		this.x = x || 0;
		this.y = y || 0;
		this.w = w || 20;
		this.h = h || 28;
		this.url = url || 'client/img/';
		this.name = name || 'default';
	}

	static list = [];
}

module.exports = ServerModalItem;
