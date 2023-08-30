export class MouseModel {
	constructor() {
		this.x = 0;
		this.y = 0;
		this.press = { x: 0, y: 0 };
		this.drag = { x: 0, y: 0 };
		this.pressing = false;
		this.absoluteX = 0;
		this.absoluteY = 0;
	}

	style(value) {
		document.body.style.cursor = value;
	}

	move(e, itemGrabbed) {
		this.setPosition(e);
		if (itemGrabbed) {
			this.style('none');
			itemGrabbed.move();
		}
	}

	setPosition(e) {
		this.x = ~~((e.clientX + cam.x) / cam.pixelSize);
		this.y = ~~((e.clientY + cam.y) / cam.pixelSize);

		this.absoluteX = e.clientX;
		this.absoluteY = e.clientY;
	}

	setPress(e) {
		if (mouse.pressing) {
			this.press = {
				x: e?.clientX || this.x,
				y: e?.clientY || this.y
			};
		}
	}

	setDrag(e) {
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
		this.style('grabbing');
	}

	stop() {
		this.drag = { x: 0, y: 0 };
		this.style('initial');
	}

	onLeftClick(e, evt) {
		if (e.button === 0 && evt) {
			evt(e);
		}
	}

	onRightClick(e, evt) {
		if (e.button === 2 && evt) {
			this.style('grab');
			evt(e);
		}
	}
}
