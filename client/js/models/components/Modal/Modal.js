import { RotationArrows } from './RotationArrows.js';
import { Color } from './Color.js';
import { ItemType } from './itemTypes.js';
import { Button } from './Button.js';
import { OptionButton } from './OptionButton.js';
import { Container } from '../Container.js';

export class Modal extends Container {
	constructor(x, y, w, h) {
		super(x, y, w, h);
		this.folder = 'wall';
		this.subfolder = 'yellow';
		this.items = null;
		this.rotationArrows = new RotationArrows();
		this.color = Color.get();
		this.itemType = ItemType.get();
	}

	resize() {
		this.y = cv.height - 210;
		this.w = cv.width - 20;

		this.rotationArrows.repositioning();
		this.color.repositioning();
		this.itemType.repositioning();
	}

	clickOnButton() {
		Button.each((button) => {
			button.intersectionEvents();
		});
	}

	paint() {
		super.paint();

		let modalItems = Modal.getItemUrl(this.items);
		modalItems.forEach((item, i) => {
			item.setPosition(this, i);
			item.paint();
		});

		this.rotationArrows.paint();
		this.color.paint();
		this.itemType.paint();
	}

	setColor(color) {
		this.subfolder = color;
		OptionButton.setButtonStrokeColor('color', color);
	}

	getColor() {
		return this.subfolder;
	}

	setType(type) {
		this.folder = type;
		OptionButton.setButtonStrokeColor('itemType', type);
	}

	getType() {
		return this.folder;
	}

	appendItems(items) {
		this.items = items;
	}

	getItems() {
		return this.items;
	}

	static create() {
		this.element = new Modal();
		OptionButton.setButtonStrokeColor('itemType', this.element.getType());
		OptionButton.setButtonStrokeColor('color', this.element.getColor());
		return this.element;
	}

	static getItemUrl(root) {
		return root[this.element.folder][this.element.subfolder];
	}

	static getActiveItems() {
		return this.getElement().getItems()[this.element.folder][
			this.element.subfolder
		];
	}

	static getType() {
		return this.getElement().getType();
	}

	static getElement() {
		return this.element;
	}
}
