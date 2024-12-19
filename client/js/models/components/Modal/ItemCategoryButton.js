import { imageHelpers } from '../../../helpers/imagehelpers.js';
import { OptionItem } from './OptionItem.js';
import { OptionButton } from './OptionButton.js';
import { ModalItem } from '../../Item/ModalItem.js';
import { Modal } from './Modal.js';

function getList(itemList) {
	const list = [];
	if (!itemList.length) {
		Object.entries(itemList).forEach(([key, val]) => {
			list.push(new ItemCategoryButton(key, val));
		});
	}

	return list;
}

class AllTypes extends OptionItem {
	constructor() {
		const itemList = getList(ModalItem.list);
		super(itemList);
	}
}

export class ItemCategoryButton extends OptionButton {
	constructor(id, itemStyles) {
		super();
		this.id = id;
		this.buttonType = 'item';
		this.swatch = this.getImage();
		console.info(itemStyles);
	}

	intersectionEvents() {
		if (this.intersects()) {
			Modal.getElement().setType(this.id);
		}
	}

	repositioning(i) {
		super.repositioning();
		let totalItemTypeWidth = this.w * i;
		this.x = totalItemTypeWidth + this.marginRight + this.gap * i;
	}

	paint() {
		super.paintContainer();
		imageHelpers.drawImage(this.swatch, imageHelpers.getSource(this.imageSize), {
			x: this.x + 3,
			y: this.y + 3,
			w: this.w - 6,
			h: this.h - 6
		});
	}

	getImage() {
		return imageHelpers.getImage('/swatches/' + this.id);
	}

	static get() {
		return new AllTypes();
	}
}
