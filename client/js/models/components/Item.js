import { helpers } from '../../helpers.js';

export class Item {
	constructor({ x, y, w, h, name }) {
		this.x = x || 0;
		this.y = y || 0;
		this.w = w || 0;
		this.h = h || 0;
		this.name = name || 'default';
		this.image = helpers.getImage(name);
	}

	setPosition(container, i) {
		let pixelSize = 6;
		this.position = {
			x: container.x + 10 + this.w * pixelSize * i * 1.1,
			y: container.y + 10,
			w: this.w * pixelSize,
			h: this.h * pixelSize
		};
	}

	mouseDrag(mouse) {}

	intersects(mouse) {
		return mouse.x < this.x;
	}

	static createList(items) {
		let list = {};
		for (const [name, item] of Object.entries(items)) {
			list[name] = {};
			for (const [key, value] of Object.entries(item)) {
				list[name][key] = new Item(value);
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
