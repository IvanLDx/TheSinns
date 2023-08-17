export class Mouse {
	constructor() {
		this.x = 0;
		this.y = 0;
		this.pressed = {};
		this.dragged = {};

		this.stop();
	}

	setPosition(e, cam) {
		this.x = ~~((e.clientX + cam.x) / cam.pixelSize);
		this.y = ~~((e.clientY + cam.y) / cam.pixelSize);
	}

	setPressedPosition() {
		this.pressed = {
			x: this.x,
			y: this.y
		};
	}

	setMovedPosition() {
		this.dragged = {
			x: this.pressed.x - this.x,
			y: this.pressed.y - this.y
		};
	}

	stop() {
		this.pressed = {
			x: 0,
			y: 0
		};

		this.dragged = {
			x: 0,
			y: 0
		};
	}

	getMovedPosition() {
		return this.dragged;
	}
}
