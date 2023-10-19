import { helpers } from '../../helpers.js';

export class Item {
	constructor(item) {
		this.x = item.x || 0;
		this.y = item.y || 0;
		this.w = item.w || 0;
		this.h = item.h || 0;
		this.url = item.url || '/';
		this.name = item.name || 'default';
		this.image = helpers.getImage(item.url + '/' + item.name);
		this.rotation = item.rotation || 0;
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
}
