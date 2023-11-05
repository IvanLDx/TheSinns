import { Button } from '../Button.js';
import { BurgerModal } from './BurgerModal.js';
let padding = 2.5;
export class BurgerButton extends Button {
	constructor(x, y, w, h) {
		super('interface/burger');
		this.x = x;
		this.y = y;
		this.w = w - padding;
		this.h = h - padding;

		this.modal = new BurgerModal(x, y, w, h);

		Button.push(this);
	}

	intersectionEvents() {
		if (this.intersects()) {
			this.modal.expand();
		}
	}

	paint() {
		this.modal.paint();
		this.paintImage();
	}

	resize() {
		let gap = 10;
		this.x = cv.width - this.w - gap + padding;
		this.y = gap + padding * 2;
		this.modal.resize(gap);
	}

	static create() {
		this.element = new BurgerButton(0, 0, 40, 40);
		return this.element;
	}
}
