import { Button } from '../Button.js';
import { Container } from '../Container.js';

export class BurgerModal extends Container {
	constructor(x, y, w, h) {
		super(x, y, w, h);
		this.buttons = this.#getButtons();
		this.expanded = false;
		this.loading = false;
		this.contractHeight = h;
		this.expandedHeight = 120;
	}

	#getButtons() {
		return [];
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
				this.h += (this.expandedHeight - this.h) / 2;
				if (this.h >= this.expandedHeight - 2) {
					this.h = this.expandedHeight;
					this.#clearInterval(interval);
				}
			});
		} else {
			this.#loadingInterval((interval) => {
				this.h -= (this.h - this.contractHeight) / 2;
				if (this.h <= this.contractHeight + 2) {
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
	}

	resize(gap) {
		this.x = cv.width - this.w - gap;
		this.y = gap;
	}
}
