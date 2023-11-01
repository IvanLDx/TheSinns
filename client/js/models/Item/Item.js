import { utils } from '../../utils.js';

export class Item {
	constructor(item) {
		this.x = item.x || 0;
		this.y = item.y || 0;
		this.w = item.w || 0;
		this.h = item.h || 0;
		this.type = utils.getFolder(item.url) || null;
		this.url = item.url || '/';
		this.name = item.name || 'default';
		this.image = utils.getImage(item.url + '/' + item.name);
		this.rotation = item.rotation || 0;
		this.#setMaxRotationWhenImageLoads();
	}

	#setMaxRotationWhenImageLoads() {
		this.image.addEventListener('load', () => {
			this.maxRotation = this.image.width / this.w - 1;
		});
	}

	paint() {
		ctx.drawImage(
			this.image,
			this.rotation * this.w,
			0,
			this.w,
			this.h,
			this.position.x,
			this.position.y,
			this.position.w,
			this.position.h
		);
	}

	rotateRight() {
		if (this.rotation <= 0) {
			this.rotation = this.maxRotation;
		} else {
			this.rotation--;
		}
	}

	rotateLeft() {
		if (this.rotation >= this.maxRotation) {
			this.rotation = 0;
		} else {
			this.rotation++;
		}
	}

	static each(evt) {
		this.list.forEach((item, i) => {
			evt(item, i);
		});
	}
}
