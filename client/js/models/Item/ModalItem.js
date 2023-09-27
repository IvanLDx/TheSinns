import { helpers } from '../../helpers.js';
const MODAL_PIXEL_SIZE = helpers.getModalPixelSize();

export class ModalItem {
	constructor({ x, y, w, h, name, rotation }) {
		this.x = x || 0;
		this.y = y || 0;
		this.w = w || 0;
		this.h = h || 0;
		this.name = name || 'default';
		this.image = helpers.getImage(name);
		this.rotation = rotation || 0;
	}

	rotateRight() {
		if (this.rotation <= 0) {
			this.rotation = 3;
		} else {
			this.rotation--;
		}
	}

	rotateLeft() {
		if (this.rotation >= 3) {
			this.rotation = 0;
		} else {
			this.rotation++;
		}
	}

	paint() {
		ctx.drawImage(
			this.image,
			this.x + this.rotation * this.w,
			this.y,
			this.w,
			this.h,
			this.position.x,
			this.position.y,
			this.position.w,
			this.position.h
		);
	}

	setPosition(container, i) {
		this.containerX =
			container.x + 10 + this.w * MODAL_PIXEL_SIZE * i * 1.1;
		this.containerY = container.y + 10;
		this.position = {
			x: this.containerX,
			y: this.containerY,
			w: this.w * MODAL_PIXEL_SIZE,
			h: this.h * MODAL_PIXEL_SIZE
		};
	}

	intersects() {
		return (
			mouse.absoluteX > this.containerX &&
			mouse.absoluteX < this.containerX + this.w * MODAL_PIXEL_SIZE &&
			mouse.absoluteY > this.containerY &&
			mouse.absoluteY < this.containerY + this.h * MODAL_PIXEL_SIZE
		);
	}

	static createList(items) {
		let list = {};
		for (const [name, item] of Object.entries(items)) {
			list[name] = {};
			for (const [key, value] of Object.entries(item)) {
				list[name][key] = new ModalItem(value);
			}
		}
		this.list = list;
	}

	static each(evt) {
		Object.values(this.list.wall).forEach((val) => {
			evt(val);
		});
	}

	static list = {};
}
