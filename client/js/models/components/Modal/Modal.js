import { RotationArrows } from './RotationArrows.js';
import { Color } from './Color.js';
import { Button } from './Button.js';

export class Modal {
	constructor(x, y, w, h) {
		this.x = x || 10;
		this.y = y || 0;
		this.w = w || 0;
		this.h = h || 200;
		this.folder = 'wall';
		this.subfolder = 'yellow';
		this.items = null;
		this.rotationArrows = new RotationArrows();
		this.color = Color.get();
	}

	resize() {
		this.y = cv.height - 210;
		this.w = cv.width - 20;

		this.rotationArrows.repositioning();
		this.color.repositioning();
	}

	clickOnButton() {
		Button.each((button) => {
			button.intersectionEvents();
		});
	}

	paint() {
		ctx.strokeStyle = '#2c4371';
		ctx.lineWidth = 8;
		ctx.strokeRect(this.x, this.y, this.w, this.h);

		ctx.fillStyle = '#e2b332';
		ctx.fillRect(this.x, this.y, this.w, this.h);

		let modalItems = Modal.getItemUrl(this.items);
		modalItems.forEach((item, i) => {
			item.setPosition(this, i);
			item.paint();
		});

		this.rotationArrows.paint();
		this.color.paint();
	}

	setColor(color) {
		this.subfolder = color;
	}

	appendItems(items) {
		this.items = items;
	}

	getItems() {
		return this.items;
	}

	static create() {
		Modal.element = new Modal();
		return Modal.element;
	}

	static getItemUrl(root) {
		return root[this.element.folder][this.element.subfolder];
	}

	static getActiveItems() {
		return this.getElement().getItems()[this.element.folder][
			this.element.subfolder
		];
	}

	static getElement() {
		return this.element;
	}

	static element = null;
}
