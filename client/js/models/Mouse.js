export class Mouse {
	constructor() {
		this.x = 0;
		this.y = 0;
		this.press = { x: 0, y: 0 };
		this.drag = { x: 0, y: 0 };
		this.pressing = false;
	}

	setPosition(e, cam) {
		this.x = ~~((e.clientX + cam.x) / cam.pixelSize);
		this.y = ~~((e.clientY + cam.y) / cam.pixelSize);
	}

	setPress(e) {
		this.pressing = true;
		this.press = {
			x: e?.clientX || this.x,
			y: e?.clientY || this.y
		};
	}

	setDrag(e, cam) {
		this.press = {
			x: this.x,
			y: this.y
		};

		this.x = e.clientX;
		this.y = e.clientY;

		let x = ~~((this.press.x - this.x) / cam.pixelSize);
		let y = ~~((this.press.y - this.y) / cam.pixelSize);

		if (Math.abs(x) < 10 && Math.abs(y) < 20) {
			this.drag = { x: x, y: y };
		}
	}

	onLeftClick(e, evt) {
		if (e.button === 0 && evt) {
			evt(e);
		}
	}

	onRightClick(e, evt) {
		if (e.button === 2 && evt) {
			evt(e);
		}
	}

	stop() {
		this.drag = { x: 0, y: 0 };
	}
}
