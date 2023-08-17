export class Mouse {
	constructor() {
		this.x = 0;
		this.y = 0;
		this.pressed = {};
		this.dragged = {};

		this.stop();
	}

	setPosition(e, pixelSize) {
		this.x = e.clientX / pixelSize;
		this.y = e.clientY / pixelSize;
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
