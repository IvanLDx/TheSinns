import { Container } from '../../components/Container.js';

export class PreferencesModal extends Container {
	constructor() {
		super();
		this.shown = false;
		this.maxSize = 120;
		this.size = 0;
		this.fillColor = 'transparent';
		this.item = null;
	}

	show(item) {
		this.changeSize = this.maximize;
		this.item = item;
		this.setPosition();
		this.shown = true;
	}

	hide() {
		this.changeSize = this.minimize;
	}

	changeSize() {
		return;
	}

	paint() {
		this.changeSize();

		ctx.beginPath();
		ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
		ctx.stroke();
	}

	maximize() {
		if (this.size < this.maxSize) {
			this.size += 20;
			if (this.size > this.maxSize) {
				this.size = this.maxSize;
			}
		}
	}

	minimize() {
		let needsResize = true;
		if (this.size > 0) {
			this.size -= 20;
			if (this.size < 0) {
				this.size = 0;
				needsResize = false;
			}
		} else {
			needsResize = false;
		}

		if (!needsResize) {
			this.item = null;
			this.shown = false;
		}
	}

	setPosition() {
		this.x = this.item.position.x + this.item.position.w / 2;
		this.y = this.item.position.y + this.item.position.h / 2;
	}

	static get() {
		if (!PreferencesModal.element) {
			PreferencesModal.element = new PreferencesModal();
		}

		return PreferencesModal.element;
	}

	static element = null;
}
