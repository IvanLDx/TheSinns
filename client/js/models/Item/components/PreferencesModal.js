import { Container } from '../../components/Container.js';
import { PreferencesModalButton } from './PreferencesModalButton.js';

export class PreferencesModal extends Container {
	constructor(touchedItems) {
		super();
		this.id = touchedItems[0].touchedTile.id;
		this.maxSize = 120;
		this.size = 0;
		this.opening = true;
		this.closing = false;
		this.fillColor = 'transparent';
		this.buttons = PreferencesModalButton.create(
			touchedItems,
			this.maxSize
		);
	}

	paint() {
		ctx.beginPath();
		ctx.strokeStyle = this.strokeColor;
		ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
		ctx.stroke();

		this.buttons.forEach((button) => {
			button.paint();
		});
	}

	resize() {
		return;
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
		this.buttons = [];
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
			PreferencesModal.remove(this.id);
		}
	}

	setPosition(grabbedItem) {
		this.x = grabbedItem.position.x + grabbedItem.position.w / 2;
		this.y = grabbedItem.position.y + grabbedItem.position.h / 2;

		this.maximize();
	}

	static create(touchedItems) {
		const id = touchedItems[0].touchedTile.id;
		const modal = PreferencesModal.get(id);
		if (!modal) {
			PreferencesModal.list.push(new PreferencesModal(touchedItems));
		}
		PreferencesModal.forEach((modal) => {
			if (modal.id !== id) {
				modal.closing = true;
			}
		});
	}

	static setPosition(grabbedItem) {
		const modal = PreferencesModal.get(grabbedItem.touchedTile.id);
		modal.setPosition(grabbedItem);
	}

	static get(id) {
		return PreferencesModal.list.find((modal) => {
			return modal.id === id;
		});
	}

	static forEach(callback) {
		PreferencesModal.list.forEach((modal, i) => {
			callback(modal, i);
		});
	}

	static remove(id) {
		PreferencesModal.forEach((modal, i) => {
			if (modal.id === id) {
				PreferencesModal.list.splice(i, 1);
			}
		});
	}

	static close() {
		PreferencesModal.forEach((modal, i) => {
			modal.closing = true;
		});
	}

	static length() {
		return PreferencesModal.list.length;
	}

	static update() {
		PreferencesModal.forEach((modal) => {
			if (modal.opening) {
				modal.resize = modal.maximize;
				this.opening = false;
			}

			if (modal.closing) {
				modal.resize = modal.minimize;
				this.closing = false;
			}

			modal.resize();
		});
	}

	static paint() {
		PreferencesModal.forEach((modal) => {
			modal.paint();
		});
	}

	static list = [];
}
