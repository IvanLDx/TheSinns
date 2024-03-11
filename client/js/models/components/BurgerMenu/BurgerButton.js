import { utils } from '../../../utils.js';
import { Button } from '../Button.js';
import { BurgerModal } from './BurgerModal.js';
let padding = 2.5;
export class BurgerButton extends Button {
	constructor(x, y, w, h) {
		super();
		this.x = x;
		this.y = y;
		this.w = w - padding;
		this.h = h - padding;
		this.imageSize = w - padding;
		this.open = false;
		this.openImage = utils.getImage('interface/openMenu');
		this.closeImage = utils.getImage('interface/closeMenu');
		this.#setCurrentImage();

		this.modal = new BurgerModal(x, y, w, h);

		Button.push(this);
	}

	#setCurrentImage() {
		this.image = this.open ? this.closeImage : this.openImage;
	}

	intersectionEvents() {
		if (this.intersects()) {
			this.modal.expand();
			this.open = this.modal.expanded;
			this.#setCurrentImage();
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
