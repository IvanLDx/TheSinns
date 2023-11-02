import { Button } from '../Button.js';
import { Container } from '../Container.js';

export class BurgerModal extends Container {
	constructor(x, y, w, h) {
		super(x, y, w, h);

		this.closeButton = new CloseButton();
	}

	paint() {
		super.paint();
		this.closeButton.paint();
	}

	resize(gap) {
		this.x = cv.width - this.w - gap;
		this.y = gap;

		this.closeButton.resize(this, gap);
	}
}

class CloseButton extends Button {
	constructor() {
		super();
		this.w = 30;
		this.h = 30;
		this.bars = this.#createBars();
	}

	#createBars() {
		return [new Bar(45), new Bar(-45)];
	}

	paint() {
		this.bars.forEach((bar) => {
			bar.paint();
		});
	}

	resize(parent, gap) {
		this.x = parent.x + parent.w - this.w - gap;
		this.y = parent.y + gap;

		this.bars.forEach((bar) => {
			bar.resize(this, gap);
		});
	}
}

class Bar {
	constructor(deg) {
		this.x = 0;
		this.y = 0;
		this.w = 30;
		this.deg = deg;
		this.gap = 0;
	}
	paint() {
		ctx.fillStyle = '#2c4371';
		ctx.translate(this.x + this.gap / 2, this.y + this.gap * 1.5);
		ctx.rotate((this.deg * Math.PI) / 180);
		ctx.fillRect(-this.w / 2, -this.h / 2, this.w, this.h);
		ctx.resetTransform();
	}
	resize(parent, gap) {
		this.x = parent.x + gap;
		this.y = parent.y;
		this.h = gap;
		this.gap = gap;
	}
}
