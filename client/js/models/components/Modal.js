export class Modal {
	constructor(x, y, w, h) {
		this.x = x || 10;
		this.y = y || 0;
		this.w = w || 0;
		this.h = h || 200;
	}

	resize() {
		this.y = cv.height - 210;
		this.w = cv.width - 20;
	}

	paint() {
		ctx.strokeStyle = '#2c4371';
		ctx.lineWidth = 8;
		ctx.strokeRect(this.x, this.y, this.w, this.h);

		ctx.fillStyle = '#e2b332';
		ctx.fillRect(this.x, this.y, this.w, this.h);

		let walls = this.items.wall;
		let i = 0;
		for (let w in walls) {
			let wall = walls[w];
			wall.setPosition(this, i);
			ctx.drawImage(
				wall.image,
				wall.x,
				wall.y,
				wall.w,
				wall.h,
				wall.position.x,
				wall.position.y,
				wall.position.w,
				wall.position.h
			);

			i++;
		}
	}

	appendItems(items) {
		this.items = items;
	}

	static create() {
		Modal.element = new Modal();
		return Modal.element;
	}

	static element = null;
}
