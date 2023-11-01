import { List } from '../../List.js';

export class Button extends List {
	constructor() {
		super();
		this.x = 0;
		this.y = 0;
		this.h = 30;
		this.setStandardStroke();
	}

	setSelectedStroke() {
		this.strokeStyle = '#f2e8a2';
	}

	setStandardStroke() {
		this.strokeStyle = '#2c4371';
	}

	repositioning() {
		this.y = cv.height - 230;
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
		ctx.strokeStyle = this.strokeStyle;
		ctx.lineWidth = 8;
		ctx.strokeRect(this.x, this.y, this.w, this.h);

		ctx.fillStyle = '#e2b332';
		ctx.fillRect(this.x, this.y, this.w, this.h);
	}
}
