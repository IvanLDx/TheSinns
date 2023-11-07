import { ModalButton } from './ModalButton.js';
import { Container } from '../Container.js';

export class BurgerModal extends Container {
	constructor(x, y, w, h) {
		super(x, y, w, h);
		this.buttons = this.#getButtons();
		this.expanded = false;
		this.loading = false;
		this.contractHeight = h;
		this.expandedHeight = 120;
		this.expandInterval = 2;
	}

	#getButtons() {
		return [new ModalButton('save', this)];
	}

	#clearInterval(interval) {
		this.loading = false;
		clearInterval(interval);
	}

	#loadingInterval(evt) {
		let interval = setInterval(() => {
			evt(interval);
		}, 1000 / 60);
	}

	#loadingActivated() {
		if (this.expanded) {
			this.#loadingInterval((interval) => {
				this.h += (this.expandedHeight - this.h) / this.expandInterval;
				if (this.h >= this.expandedHeight - this.expandInterval) {
					this.h = this.expandedHeight;
					this.#clearInterval(interval);
				}
			});
		} else {
			this.#loadingInterval((interval) => {
				this.h -= (this.h - this.contractHeight) / this.expandInterval;
				if (this.h <= this.contractHeight + this.expandInterval) {
					this.h = this.contractHeight;
					this.loading = false;
					this.#clearInterval(interval);
				}
			});
		}
	}

	expand() {
		if (!this.loading) {
			this.expanded = !this.expanded;
			this.loading = true;
			this.#loadingActivated();
		}
	}

	paint() {
		super.paint();
		this.buttons[0].paintImage();
	}

	resize(gap) {
		this.x = cv.width - this.w - gap;
		this.y = gap;

		this.buttons[0].x = this.x + 5;
		this.buttons[0].y = this.y + 50;
	}
}
