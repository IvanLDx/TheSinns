import { ModalItem } from './ModalItem.js';
import { Socket } from '../Socket.js';

let grabbedItem;

export class GrabbedItem extends ModalItem {
	constructor(item) {
		super(item);
		this.type = 'GrabbedItem';
		this.id = this.id || this.createID();
		this.touchedTile = null;
	}

	move() {
		this.x = mouse.absoluteX - (this.w * cam.pixelSize) / 2;
		this.y = mouse.absoluteY - this.h * cam.pixelSize + 5 * cam.pixelSize;
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

	static completeGrab() {
		if (grabbedItem && grabbedItem.touchedTile) {
			Socket.placeGrabbedItem();
		}
		this.remove();
	}

	static tryToCreate() {
		ModalItem.each((item) => {
			if (item.intersects()) {
				this.grab(item);
			}
		});
	}

	static grab(item) {
		grabbedItem = new GrabbedItem(item);
		this.element = grabbedItem;
		grabbedItem.move();
	}

	static tryToSelect() {
		if (mouse.touchedTile) {
			if (this.element.id === item.touchedTile.id) {
				this.selected = item;
			}
		}
	}

	static remove() {
		grabbedItem = null;
		this.element = null;
	}

	static paint() {
		let tile = {};
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
				grabbedItem.rotation * grabbedItem.w,
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

	static setTouchedTile(tile) {
		if (this.element) {
			this.element.touchedTile = {
				id: tile.id,
				col: tile.col,
				row: tile.row
			};
		}
	}

	static unsetTouchedTile() {
		if (this.element) {
			this.element.touchedTile = null;
		}
	}

	static element = null;
}
