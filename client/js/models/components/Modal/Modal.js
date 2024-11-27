import { RotationArrows } from './RotationArrows.js';
import { Color } from './Color.js';
import { ItemType } from './ItemTypes.js';
import { Button } from '../Button.js';
import { OptionButton } from './OptionButton.js';
import { Container } from '../Container.js';

export class Modal extends Container {
	constructor(x, y, w, h) {
		super(x, y, w, h);
		this.folder = 'wall';
		this.subfolder = 'yellow';
		this.items = {};
		this.rotationArrows = new RotationArrows();
		this.color = Color.get();
		this.itemType = ItemType.get();
		this.needsToPositionItems = false;
	}

	resize() {
		this.y = cv.height - 210;
		this.w = cv.width - 20;
		this.right = this.x + this.w;

		this.rotationArrows.repositioning();
		this.color.repositioning();
		this.itemType.repositioning();

		this.updatePositionItems();
	}

	updatePositionItems() {
		this.needsToPositionItems = true;
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
			if (this.needsToPositionItems) {
				item.setPosition(this, i);
			}

			item.paint();
		});

		if (this.needsToPositionItems) {
			this.needsToPositionItems = false;
		}

		this.rotationArrows.paint();
		this.color.paint();
		this.itemType.paint();
	}

	setColor(color) {
		this.subfolder = color;
		OptionButton.setButtonStrokeColor('color', color);
		this.updatePositionItems();
	}

	getColor() {
		return this.subfolder;
	}

	setType(type) {
		this.folder = type;
		OptionButton.setButtonStrokeColor('itemType', type);
		this.updatePositionItems();
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
		if (!this.element) {
			this.element = new Modal();
			OptionButton.setButtonStrokeColor('itemType', this.element.getType());
			OptionButton.setButtonStrokeColor('color', this.element.getColor());
			this.element.updatePositionItems();
		}
		return this.getElement();
	}

	static getItemUrl(root) {
		return root[this.element.folder] && root[this.element.folder][this.element.subfolder];
	}

	static getActiveItems() {
		return this.getElement().getItems()[this.element.folder][this.element.subfolder];
	}

	static getType() {
		return this.getElement().getType();
	}

	static getElement() {
		return this.element;
	}
}
