import { PaginationArrows, RotationArrows } from './Arrows.js';
import { Pagination } from './Pagination.js';
import { ItemCategoryButton } from './ItemCategoryButton.js';
import { Button } from '../Button.js';
import { Container } from '../Container.js';
import { ItemStyleButton } from './ItemStyleButton.js';
import { ModalItem } from '../../Item/ModalItem.js';

export class Modal extends Container {
	constructor(x, y, w, h) {
		super(x, y, w, h);
		this.category = 'wallElement';
		this.style = 'door';
		this.items = {};
		this.rotationArrows = new RotationArrows(this);
		this.paginationArrows = new PaginationArrows(this);
		this.pagination = new Pagination(this);
		this.itemCategoryButtons = ItemCategoryButton.get();
		this.isSmallerThanItemList = false;
		this.modalItems = [];
	}

	resize() {
		this.y = cv.height - 210;
		this.w = cv.width - 20;
		this.right = this.x + this.w;

		this.rotationArrows.repositioning();
		this.paginationArrows.repositioning();
		this.itemCategoryButtons.repositioning();
	}

	checkIsSmallerThanItemList(itemRight) {
		if (itemRight) {
			this.isSmallerThanItemList = itemRight > this.x + this.w - 45;
		}

		return this.isSmallerThanItemList;
	}

	clickOnButton() {
		Button.each((button) => {
			button.intersectionEvents();
		});
	}

	update() {
		this.modalItems = Modal.getItemUrl(this.items);

		this.pagination.resetPagination();
		this.pagination.setPagination(this.modalItems);

		this.modalItems.forEach((item, i) => {
			item.setPosition(this, i, this.pagination);
		});
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
		this.itemCategoryButtons.paint();
	}

	getStyle() {
		return this.style;
	}

	setStyle(style) {
		this.style = style;
		return style;
	}

	getCategory() {
		return this.category;
	}

	setCategory(category) {
		this.category = category;
		return category;
	}

	appendItems(items) {
		this.items = items;
	}

	getItems() {
		return this.items;
	}

	getModalItems() {
		return this.modalItems;
	}

	setModalItems() {
		this.modalItems = Modal.getItemUrl(this.getItems());
	}

	getItemListFromRoot(root) {
		return root[this.getCategory()][this.getStyle()];
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

			ItemCategoryButton.setButtonStrokeColor(this.element.getCategory());
			ItemStyleButton.setButtonStrokeColor(this.element.getStyle());
		}
		return this.getElement();
	}

	static getItemUrl(root) {
		const modal = this.getElement();
		let style = modal.getItemListFromRoot(root);
		if (!style) {
			const keys = Object.keys(root[modal.getCategory()]);
			const firstKey = keys.length > 0 ? keys[0] : null;

			if (firstKey) {
				modal.setStyle(firstKey);
				style = modal.getItemListFromRoot(root);
			}
		}

		return style;
	}

	static getActiveItems() {
		return this.getElement().getModalItems();
	}

	static loopActiveItems(evt) {
		return this.getActiveItems().forEach((item) => {
			evt(item);
		});
	}

	static getElement() {
		return this.element;
	}
}
