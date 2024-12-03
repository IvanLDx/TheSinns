import { Container } from '../../components/Container.js';
import { ItemPopupButton } from './ItemPopupButton.js';

export class ItemPopup extends Container {
	constructor(touchedItems) {
		super();
		this.id = touchedItems[0].touchedTile.id;
		this.maxSize = 120;
		this.size = 0;
		this.opening = true;
		this.closing = false;
		this.fillColor = 'transparent';
		this.buttons = ItemPopupButton.create(touchedItems, this.maxSize);
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
			ItemPopup.remove(this.id);
		}
	}

	setPosition(grabbedItem) {
		this.x = grabbedItem.position.x + grabbedItem.position.w / 2;
		this.y = grabbedItem.position.y + grabbedItem.position.h / 2;

		this.maximize();
	}

	static create(touchedItems) {
		const id = touchedItems[0].touchedTile.id;
		const modal = ItemPopup.get(id);
		if (!modal) {
			ItemPopup.list.push(new ItemPopup(touchedItems));
		}
		ItemPopup.forEach((modal) => {
			if (modal.id !== id) {
				modal.closing = true;
			}
		});
	}

	static setPosition(grabbedItem) {
		if (grabbedItem.touchedTile) {
			const modal = ItemPopup.get(grabbedItem.touchedTile.id);
			modal.setPosition(grabbedItem);
		}
	}

	static get(id) {
		return ItemPopup.list.find((modal) => {
			return modal.id === id;
		});
	}

	static forEach(callback) {
		ItemPopup.list.forEach((modal, i) => {
			callback(modal, i);
		});
	}

	static remove(id) {
		ItemPopup.forEach((modal, i) => {
			if (modal.id === id) {
				ItemPopup.list.splice(i, 1);
			}
		});
	}

	static close() {
		ItemPopup.forEach((modal, i) => {
			modal.closing = true;
		});
	}

	static length() {
		return ItemPopup.list.length;
	}

	static update() {
		ItemPopup.forEach((modal) => {
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
		ItemPopup.forEach((modal) => {
			modal.paint();
		});
	}

	static getTouchedButton() {
		let touchedButton = null;
		ItemPopup.forEach((popup) => {
			popup.buttons.forEach((button) => {
				const buttonObject = {
					x: button.x - button.radius,
					y: button.y - button.radius,
					w: button.radius * 2,
					h: button.radius * 2
				};

				if (mouse.absoluteIntersects(buttonObject)) {
					touchedButton = button;
				}
			});
		});

		return touchedButton;
	}

	static list = [];
}
