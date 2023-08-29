import { helpers } from '../../helpers.js';
import { Socket } from '../Socket.js';
import { GrabbedItem } from './GrabbedItem.js';
const MODAL_PIXEL_SIZE = helpers.getModalPixelSize();

export class Item {
	constructor({ x, y, w, h, name }) {
		this.x = x || 0;
		this.y = y || 0;
		this.w = w || 0;
		this.h = h || 0;
		this.name = name || 'default';
		this.image = helpers.getImage(name);
	}

	setPosition(container, i) {
		this.containerX =
			container.x + 10 + this.w * MODAL_PIXEL_SIZE * i * 1.1;
		this.containerY = container.y + 10;
		this.position = {
			x: this.containerX,
			y: this.containerY,
			w: this.w * MODAL_PIXEL_SIZE,
			h: this.h * MODAL_PIXEL_SIZE
		};
	}

	intersects() {
		return (
			mouse.absoluteX > this.containerX &&
			mouse.absoluteX < this.containerX + this.w * MODAL_PIXEL_SIZE &&
			mouse.absoluteY > this.containerY &&
			mouse.absoluteY < this.containerY + this.h * MODAL_PIXEL_SIZE
		);
	}

	createGrabItem() {
		Item.grabbed = new GrabbedItem(this);
		Item.grabbed.move();
	}

	createID() {
		const getFormattedDate = function (date) {
			let formattedDate = date;
			if (date < 10) {
				formattedDate = '0' + date;
			} else {
				formattedDate = '' + date;
			}
			return formattedDate;
		};

		let rawDate = new Date();
		let year = getFormattedDate(rawDate.getFullYear());
		let month = getFormattedDate(rawDate.getMonth() + 1);
		let day = getFormattedDate(rawDate.getDate());
		let hour = getFormattedDate(rawDate.getHours());
		let minutes = getFormattedDate(rawDate.getMinutes());
		let seconds = getFormattedDate(rawDate.getSeconds());
		let date = year + month + day + '-' + hour + minutes + seconds + '-';
		let rdm = ~~(Math.random() * 9000 + 1000);
		return date + rdm;
	}

	static createList(items) {
		let list = {};
		for (const [name, item] of Object.entries(items)) {
			list[name] = {};
			for (const [key, value] of Object.entries(item)) {
				list[name][key] = new Item(value);
			}
		}
		this.list = list;
	}

	static each(evt) {
		Object.values(this.list.wall).forEach((val) => {
			evt(val);
		});
	}

	static handleIntersections() {
		this.each((item) => {
			if (item.intersects()) {
				item.createGrabItem();
			}
		});
	}

	static completeGrab() {
		if (this.grabbed && this.grabbed.touchedTile) {
			Socket.placeGrabbedItem();
		}
		this.grabbed = null;
	}

	static paintGrabbedItem() {
		let tile = {};
		let grabbedItem = this.grabbed;
		if (grabbedItem) {
			if (grabbedItem.touchedTile) {
				tile = {
					x:
						(grabbedItem.touchedTile.col + 1) * cam.pixelSize -
						cam.x,
					y:
						(grabbedItem.touchedTile.row + 1) * cam.pixelSize -
						cam.y -
						(grabbedItem.h - 10) * cam.pixelSize,
					w: (grabbedItem.w - 2) * cam.pixelSize + cam.pixelSize * 2,
					h: (grabbedItem.h - 1) * cam.pixelSize + cam.pixelSize
				};
			} else {
				tile = {};
			}

			ctx.globalAlpha = 0.6;
			ctx.drawImage(
				grabbedItem.image,
				0,
				0,
				grabbedItem.w,
				grabbedItem.h,
				tile.x || grabbedItem.x,
				tile.y || grabbedItem.y,
				tile.w || grabbedItem.w * cam.pixelSize,
				tile.h || grabbedItem.h * cam.pixelSize
			);
		}
	}

	static list = {};
	static grabbed = null;
}
