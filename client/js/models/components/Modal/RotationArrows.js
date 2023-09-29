import { helpers } from '../../../helpers.js';
import { Button } from './Button.js';

export class RotationArrows extends Button {
	constructor() {
		super();
		this.w = 60;
		this.leftArrow = new leftArrow();
		this.rightArrow = new RightArrow();
	}

	repositioning() {
		super.repositioning();
		this.x = cv.width / 2 - this.w / 2;
	}

	paint() {
		super.paint();
		this.leftArrow.paint(this);
		this.rightArrow.paint(this);
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

	paint() {
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

	paint(RotationModal) {
		this.x = RotationModal.x + 5;
		this.y = RotationModal.y + 5;
		super.paint();
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

	paint(RotationModal) {
		this.x = RotationModal.x + RotationModal.w - this.w - 5;
		this.y = RotationModal.y + 5;
		super.paint();
	}
}
