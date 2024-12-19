import { PaginationArrows, RotationArrows } from './Arrows.js';
import { Pagination } from './Pagination.js';
import { ItemSubType } from './ItemSubType.js';
import { ItemTypeButton } from './ItemTypeButton.js';
import { Button } from '../Button.js';
import { OptionButton } from './OptionButton.js';
import { Container } from '../Container.js';

export class Modal extends Container {
	constructor(x, y, w, h) {
		super(x, y, w, h);
		this.folder = 'wall';
		this.subfolder = 'flat';
		this.items = {};
		this.rotationArrows = new RotationArrows(this);
		this.paginationArrows = new PaginationArrows(this);
		this.pagination = new Pagination(this);
		this.itemSubType = ItemSubType.get();
		this.ItemTypeButton = ItemTypeButton.get();
		this.needsToPositionItems = false;
		this.isSmallerThanItemList = false;
		this.modalItems = [];
	}

	resize() {
		this.y = cv.height - 210;
		this.w = cv.width - 20;
		this.right = this.x + this.w;

		this.rotationArrows.repositioning();
		this.paginationArrows.repositioning();
		this.itemSubType.repositioning();
		this.ItemTypeButton.repositioning();

		this.updatePositionItems();
	}

	checkIsSmallerThanItemList(itemRight) {
		if (itemRight) {
			this.isSmallerThanItemList = itemRight > this.x + this.w - 45;
		}

		return this.isSmallerThanItemList;
	}

	updatePositionItems() {
		this.needsToPositionItems = true;
	}

	clickOnButton() {
		Button.each((button) => {
			button.intersectionEvents();
		});
	}

	update() {
		this.modalItems = Modal.getItemUrl(this.items);

		if (this.needsToPositionItems) {
			this.pagination.resetPagination();
			this.pagination.setPagination(this.modalItems);

			this.modalItems.forEach((item, i) => {
				item.setPosition(this, i, this.pagination);
			});

			this.needsToPositionItems = false;
		}
	}

	paint() {
		super.paint();

		const currentPageItems = this.modalItems.filter((item) => {
			return item.page === this.pagination.currentPage;
		});

		currentPageItems.forEach((item) => {
			item.paint();
		});

		this.paginationArrows.paint();
		this.rotationArrows.paint();
		this.itemSubType.paint();
		this.ItemTypeButton.paint();
	}

	setColor(color) {
		this.subfolder = color;
		OptionButton.setButtonStrokeColor('itemSubType', color);
		this.updatePositionItems();
	}

	getColor() {
		return this.subfolder;
	}

	setType(type) {
		this.folder = type;
		OptionButton.setButtonStrokeColor('item', type);
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

	static delete() {
		this.element = null;
		return null;
	}

	static reset() {
		this.element = null;
		return this.create();
	}

	static create() {
		if (!this.element) {
			this.element = new Modal();
			OptionButton.setButtonStrokeColor('item', this.element.getType());
			OptionButton.setButtonStrokeColor('itemSubType', this.element.getColor());
			this.element.updatePositionItems();
		}
		return this.getElement();
	}

	static getItemUrl(root) {
		let subfolder = root[this.element.folder][this.element.subfolder];
		if (!subfolder) {
			const keys = Object.keys(root[this.element.folder]);
			const firstKey = keys.length > 0 ? keys[0] : null;

			if (firstKey) {
				this.element.subfolder = firstKey;
				subfolder = root[this.element.folder][this.element.subfolder];
			}
		}

		return subfolder;
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
