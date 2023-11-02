import { Button } from '../Button.js';
import { BurgerModal } from './BurgerModal.js';
const barGap = 6;

export class BurgerButton extends Button {
	constructor(x, y, w, h) {
		super();
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;

		this.bars = this.#createBars();
		this.modal = new BurgerModal(x, y, w, h);

		Button.push(this);
	}

	intersectionEvents() {
		if (this.intersects()) {
			_('yeh');
		}
	}

	#createBars() {
		let barQty = 3;
		let bars = [];
		for (let i = 0; i < barQty; i++) {
			let betweenY = ((this.h - barGap) / barQty) * i;
			bars.push(new Bar(betweenY));
		}
		return bars;
	}

	paint() {
		this.modal.paint();
		this.bars.forEach((bar) => {
			bar.paint();
		});
	}

	resize() {
		let gap = 10;
		this.x = cv.width - this.w - gap;
		this.y = gap;

		this.bars.forEach((bar) => {
			bar.resize(this);
		});
		this.modal.resize(gap);
	}

	static create() {
		this.element = new BurgerButton(0, 0, 40, 40);
		return this.element;
	}
}

class Bar {
	constructor(betweenY) {
		this.betweenY = betweenY;
		this.x = 0;
		this.y = 0;
		this.w = 0;
		this.h = 0;
	}

	paint() {
		ctx.fillStyle = '#2c4371';
		ctx.fillRect(this.x, this.y, this.w, this.h);
	}

	resize(parent) {
		this.x = parent.x + barGap;
		this.y = parent.y + this.betweenY + barGap;
		this.w = parent.w - barGap * 2;
		this.h = barGap;
	}
}
