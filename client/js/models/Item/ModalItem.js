import { Item } from './Item.js';
import { utils } from '../../utils.js';
import { imageHelpers } from '../../helpers/imagehelpers.js';
import { Modal } from '../components/Modal/Modal.js';
const MODAL_PIXEL_SIZE = utils.getModalPixelSize();

export class ModalItem extends Item {
	constructor({ x, y, w, h, url, name, rotation, sku }) {
		super({ x, y, w, h, url, name, rotation });
		this.sku = sku;
		this.locationType = 'ModalItem';
		this.category = utils.getCategory(url);
		this.style = utils.getStyle(url);
		this.backgroundImage = imageHelpers.getImage('misc/itemBackground');
		this.destinationY = this.getDestinationY();
		this.containerX = 0;
		this.containerY = 0;
		this.right = 0;
		this.page = 1;
	}

	getDestinationY(container) {
		if (container) {
			this.destinationY = this.containerY = container.y + 20;
		}
		return this.destinationY;
	}

	setPosition(container, i, pagination) {
		const position = i % pagination.getItemsByPage();
		if (position === 0) {
			pagination.setTotalPages();
		}

		this.page = pagination.totalPages;
		this.containerX = container.x + 10 + this.w * MODAL_PIXEL_SIZE * ModalItem.getMarginRight(position);

		this.position = {
			x: this.containerX,
			y: this.getDestinationY(container),
			w: this.w * MODAL_PIXEL_SIZE,
			h: this.h * MODAL_PIXEL_SIZE
		};
	}

	paint() {
		imageHelpers.drawImage(
			this.backgroundImage,
			{
				x: 0,
				y: 0,
				w: this.w,
				h: this.h
			},
			this.position
		);

		super.paint();
	}

	intersects() {
		return (
			Modal.getElement().pagination.currentPage === this.page &&
			mouse.absoluteX > this.containerX &&
			mouse.absoluteX < this.containerX + this.w * MODAL_PIXEL_SIZE &&
			mouse.absoluteY > this.containerY &&
			mouse.absoluteY < this.containerY + this.h * MODAL_PIXEL_SIZE
		);
	}

	static createList(items) {
		let list = {};

		Object.entries(items.serverModalItems).forEach(([key, val]) => {
			list[key] = {};
			Object.entries(val).forEach(([subKey, subVal]) => {
				list[key][subKey] = subVal.map((itemVal) => {
					return new ModalItem(itemVal);
				});
			});
		});

		this.list = list;
	}

	static each(evt) {
		let list = Modal.getItemUrl(this.list) || [];
		list.forEach((val) => {
			evt(val);
		});
	}

	static getMarginRight(i) {
		return i * this.marginRight;
	}

	static itemWidth = 0;

	static marginRight = 1.1;

	static list = [];
}
