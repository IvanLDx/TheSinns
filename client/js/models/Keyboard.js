export class KeyboardModel {
	constructor() {
		this.pressing = {};
	}

	onkeydown(e, callback) {
		if (this.pressing[e.code]) {
			return;
		}

		this.pressing[e.code] = true;
		callback && callback(e.code);
	}

	onkeyup(e, callback) {
		if (!this.pressing[e.code]) {
			return;
		}

		delete this.pressing[e.code];
		callback && callback(e.code);
	}
}
