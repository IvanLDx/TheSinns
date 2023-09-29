import { RotationArrows } from './RotationArrows.js';
import { Color } from './Color.js';

export class Modal {
	constructor(x, y, w, h) {
		this.x = x || 10;
		this.y = y || 0;
		this.w = w || 0;
		this.h = h || 200;
		this.rotationArrows = new RotationArrows();
		this.color = Color.get();
	}

	resize() {
		this.y = cv.height - 210;
		this.w = cv.width - 20;

		this.rotationArrows.repositioning();
		this.color.repositioning();
	}

	clickOnArrowButton() {
		this.rotationArrows.leftArrow.intersectionEvents(this.items);
		this.rotationArrows.rightArrow.intersectionEvents(this.items);
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

		this.rotationArrows.paint();
		this.color.paint();
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
