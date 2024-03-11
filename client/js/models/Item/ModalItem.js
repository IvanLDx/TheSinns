import { Item } from './Item.js';
import { utils } from '../../utils.js';
import { Modal } from '../components/Modal/Modal.js';
const MODAL_PIXEL_SIZE = utils.getModalPixelSize();

export class ModalItem extends Item {
	constructor({ x, y, w, h, url, name, rotation }) {
		super({ x, y, w, h, url, name, rotation });
		this.locationType = 'ModalItem';
		this.type = utils.getFolder(url);
		this.backgroundImage = utils.getImage('misc/itemBackground');
	}

	setPosition(container, i) {
		this.containerX =
			container.x + 10 + this.w * MODAL_PIXEL_SIZE * i * 1.1;
		this.containerY = container.y + 20;
		this.position = {
			x: this.containerX,
			y: this.containerY,
			w: this.w * MODAL_PIXEL_SIZE,
			h: this.h * MODAL_PIXEL_SIZE
		};
	}

	paint() {
		ctx.drawImage(
			this.backgroundImage,
			0,
			0,
			this.w,
			this.h,
			this.position.x,
			this.position.y,
			this.position.w,
			this.position.h
		);

		super.paint();
	}

	intersects() {
		return (
			mouse.absoluteX > this.containerX &&
			mouse.absoluteX < this.containerX + this.w * MODAL_PIXEL_SIZE &&
			mouse.absoluteY > this.containerY &&
			mouse.absoluteY < this.containerY + this.h * MODAL_PIXEL_SIZE
		);
	}

	static createList(items) {
		let list = {};
		utils.forEachObject(items, (item, key) => {
			list[key] = {};
			utils.forEachObject(item, (subItem, subKey) => {
				list[key][subKey] = [];
				subItem.forEach((value) => {
					list[key][subKey].push(new ModalItem(value));
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
}
