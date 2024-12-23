import { imageHelpers } from '../../../helpers/imagehelpers.js';
import { OptionItem } from './OptionItem.js';
import { OptionButton } from './OptionButton.js';
import { ModalItem } from '../../Item/ModalItem.js';
import { Modal } from './Modal.js';
import { ItemStyleButton } from './ItemStyleButton.js';

function getList(itemList) {
	const list = [];
	if (!itemList.length) {
		Object.entries(itemList).forEach(([key, val]) => {
			list.push(new ItemCategoryButton(key, val));
		});
	}

	return list;
}

class AllCategories extends OptionItem {
	constructor() {
		const itemList = getList(ModalItem.list);
		super(itemList);
	}
}

export class ItemCategoryButton extends OptionButton {
	constructor(id, itemStyles) {
		super();
		this.id = id;
		this.swatch = this.getImage();
		this.itemStyleButtons = this.setItemStyleButtons(itemStyles);

		ItemCategoryButton.push(this);
	}

	setItemStyleButtons(itemStyles) {
		const list = [];
		Object.entries(itemStyles).forEach(([key]) => {
			list.push(new ItemStyleButton(key, this.id));
		});

		return list;
	}

	intersectionEvents() {
		if (this.intersects()) {
			const modal = Modal.getElement();
			modal.setCategory(this.id);
			modal.setModalItems();
			ItemCategoryButton.setButtonStrokeColor(modal.getCategory());
			ItemStyleButton.setButtonStrokeColor(modal.getStyle());
			modal.updatePositionItems();
		}
	}

	repositioning(i) {
		super.repositioning();
		let totalItemWidth = this.w * i;
		this.x = totalItemWidth + this.marginRight + this.gap * i;

		this.itemStyleButtons.forEach((button, i) => {
			button.repositioning(i);
		});
	}

	paint() {
		super.paintContainer();
		imageHelpers.drawImage(this.swatch, imageHelpers.getSource(this.imageSize), {
			x: this.x + 3,
			y: this.y + 3,
			w: this.w - 6,
			h: this.h - 6
		});

		if (this.id === Modal.getElement().getCategory()) {
			this.itemStyleButtons.forEach((button) => {
				button.paint();
			});
		}
	}

	getImage() {
		return imageHelpers.getImage('/swatches/' + this.id);
	}

	static get() {
		return new AllCategories();
	}

	static setButtonStrokeColor(id) {
		this.each((button) => {
			if (button.id === id) {
				button.selected = true;
				button.setSelectedStroke();
			} else {
				button.setStandardStroke();
				button.selected = false;
			}
		});
	}

	static list = [];
}
