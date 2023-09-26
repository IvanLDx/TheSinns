import { helpers } from '../../helpers.js';

export class Modal {
	constructor(x, y, w, h) {
		this.x = x || 10;
		this.y = y || 0;
		this.w = w || 0;
		this.h = h || 200;
		this.rotation = new Rotation();
	}

	resize() {
		this.y = cv.height - 210;
		this.w = cv.width - 20;

		this.rotation.resize();
	}

	clickOnArrowButton() {
		this.rotation.intersects(this.items);
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
			wall.paint();

			i++;
		}

		this.rotation.paint();
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

class Rotation {
	constructor() {
		this.x = 0;
		this.y = 0;
		this.w = 60;
		this.h = 30;
		this.leftArrow = new leftArrow();
		this.rightArrow = new RightArrow();
	}

	resize() {
		this.x = cv.width / 2 - this.w / 2;
		this.y = cv.height - 230;
	}

	paint() {
		ctx.strokeStyle = '#2c4371';
		ctx.lineWidth = 8;
		ctx.strokeRect(this.x, this.y, this.w, this.h);

		ctx.fillStyle = '#e2b332';
		ctx.fillRect(this.x, this.y, this.w, this.h);

		this.leftArrow.paint(this);
		this.rightArrow.paint(this);
	}

	intersects(items) {
		this.leftArrow.intersectionEvents(items);
		this.rightArrow.intersectionEvents(items);
	}
}

class ArrowButton {
	constructor() {
		this.w = 20;
		this.h = 20;
	}

	intersects() {
		return (
			mouse.absoluteX > this.x &&
			mouse.absoluteX < this.x + this.w &&
			mouse.absoluteY > this.y &&
			mouse.absoluteY < this.y + this.h
		);
	}

	superPaint() {
		ctx.drawImage(
			this.image,
			0,
			0,
			this.w,
			this.h,
			this.x,
			this.y,
			this.w,
			this.h
		);
	}
}

class leftArrow extends ArrowButton {
	constructor(direction) {
		super(direction);
		this.image = helpers.getImage('interface/leftArrow');
	}

	intersectionEvents(items) {
		if (this.intersects()) {
			Object.entries(items.wall).forEach((wall) => {
				wall[1].rotateLeft();
			});
		}
	}

	paint(Rotation) {
		this.x = Rotation.x + 5;
		this.y = Rotation.y + 5;
		this.superPaint();
	}
}

class RightArrow extends ArrowButton {
	constructor(direction) {
		super(direction);
		this.image = helpers.getImage('interface/rightArrow');
	}

	intersectionEvents(items) {
		if (this.intersects()) {
			Object.entries(items.wall).forEach((wall) => {
				wall[1].rotateRight();
			});
		}
	}

	paint(Rotation) {
		this.x = Rotation.x + Rotation.w - this.w - 5;
		this.y = Rotation.y + 5;
		this.superPaint();
	}
}
