import { ModalButton } from './ModalButton.js';
import { Button } from '../Button.js';
import { Container } from '../Container.js';

export class BurgerModal extends Container {
	constructor(x, y, w, h) {
		super(x, y, w, h);
		this.buttons = [];
		this.expanded = false;
		this.loading = false;
		this.contractHeight = h;
		this.expandInterval = 4;
	}

	#removeButtons() {
		let buttonToRemoveIndex = [];
		Button.list.forEach((buttonInList, i) => {
			this.buttons.forEach((button) => {
				if (buttonInList === button) {
					buttonToRemoveIndex.push(i);
				}
			});
		});
		buttonToRemoveIndex.reverse();
		buttonToRemoveIndex.forEach((iter) => {
			Button.list.splice(iter, 1);
		});
		this.buttons = [];
	}

	#setButtons() {
		let buttonConfigs = [
			{ type: 'save' },
			{ type: 'open' },
			{ type: 'toolkit' }
		];
		this.buttons = [];
		buttonConfigs.forEach((config, i) => {
			this.buttons.push(ModalButton.create(config.type, this, i));
		});
	}

	#setExpandedHeight() {
		let buttonCount = this.buttons.length;
		let innerButtonsH = this.y + this.contractHeight;
		let y = innerButtonsH * buttonCount;
		let height = y + this.contractHeight;
		this.expandedHeight = height;
	}

	#clearInterval(interval) {
		this.loading = false;
		clearInterval(interval);
	}

	#each(evt) {
		this.buttons.forEach((button, i) => {
			evt(button, i);
		});
	}

	#loadingInterval(evt) {
		let interval = setInterval(() => {
			evt(interval);
		}, 1000 / 60);
	}

	#loadingActivated() {
		if (this.expanded) {
			this.#setButtons();
			this.#setExpandedHeight();
			this.#loadingInterval((interval) => {
				this.h += (this.expandedHeight - this.h) / this.expandInterval;
				if (this.h >= this.expandedHeight - 1) {
					this.h = this.expandedHeight;
					this.#clearInterval(interval);
				}
			});
		} else {
			this.#loadingInterval((interval) => {
				this.h -= (this.h - this.contractHeight) / this.expandInterval;
				if (this.h <= this.contractHeight + 1) {
					this.h = this.contractHeight;
					this.loading = false;
					this.#clearInterval(interval);
					this.#removeButtons();
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
		this.#each((button) => {
			button.paintImage();
		});
	}

	resize(gap) {
		this.x = cv.width - this.w - gap;
		this.y = gap;

		this.#each((button) => {
			button.setPosition();
		});
	}
}
