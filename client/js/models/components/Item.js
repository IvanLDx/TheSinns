class Item {
	constructor(x, y, w, h, name) {
		this.x = x || 0;
		this.y = y || 0;
		this.w = w || 0;
		this.h = h || 0;
		this.name = name || 'default';
	}

	static list = [];
}
