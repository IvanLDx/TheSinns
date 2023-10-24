import { Button } from './Button.js';
import { Modal } from './Modal.js';

class AllColors {
	constructor() {
		this.list = [new Yellow(), new Red(), new Blue(), new Green()];
	}
	paint() {
		this.list.forEach((color) => {
			color.paint();
		});
	}

	repositioning() {
		this.list.forEach((color, i) => {
			color.repositioning(i);
		});
	}
}

export class Color extends Button {
	constructor() {
		super();
		this.w = 30;

		Button.push(this);
	}

	paint() {
		super.paint();
		ctx.fillStyle = this.color;
		ctx.fillRect(this.x + 5, this.y + 5, this.w - 10, this.h - 10);
	}

	intersectionEvents() {
		if (this.intersects()) {
			Modal.getElement().setColor(this.id);
		}
	}

	repositioning(i) {
		super.repositioning();
		let marginRight = 20;
		let gap = 16 * i;
		let totalColorWidth = this.w * (i + 1);
		this.x = cv.width - totalColorWidth - marginRight - gap;
	}

	static get() {
		return new AllColors();
	}
}

export class Yellow extends Color {
	constructor() {
		super();
		this.id = 'yellow';
		this.color = '#e6c26c';
	}
}

export class Red extends Color {
	constructor() {
		super();
		this.id = 'red';
		this.color = '#eb9486';
	}
}

export class Blue extends Color {
	constructor() {
		super();
		this.id = 'blue';
		this.color = '#6c8bd5';
	}
}

export class Green extends Color {
	constructor() {
		super();
		this.id = 'green';
		this.color = '#89b188';
	}
}
