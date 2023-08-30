import { Item } from './Item.js';
import { Tile } from '../Tile.js';
import { helpers } from '../../helpers.js';
import { Socket } from '../Socket.js';

let grabbedItem;

export class GrabbedItem extends Item {
	constructor(item) {
		super(item);
		this.image = helpers.getImage(this.name);
		this.id = this.createID();
		this.touchedTile = null;
	}

	move() {
		this.x = mouse.absoluteX - (this.w * cam.pixelSize) / 2;
		this.y = mouse.absoluteY - this.h * cam.pixelSize + 5 * cam.pixelSize;
	}
	paint() {
		let tile = {};
		if (Tile.touchedTile) {
			tile = {
				x: (Tile.touchedTile.col + 1) * cam.pixelSize - cam.x,
				y:
					(Tile.touchedTile.row + 1) * cam.pixelSize -
					cam.y -
					(this.h - 10) * cam.pixelSize,
				w: (this.w - 2) * cam.pixelSize + cam.pixelSize * 2,
				h: (this.h - 1) * cam.pixelSize + cam.pixelSize
			};
		} else {
			tile = {};
		}

		ctx.globalAlpha = 0.6;
		ctx.drawImage(
			this.image,
			0,
			0,
			this.w,
			this.h,
			tile.x || this.x,
			tile.y || this.y,
			tile.w || this.w * cam.pixelSize,
			tile.h || this.h * cam.pixelSize
		);
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
		Item.each((item) => {
			if (item.intersects()) {
				grabbedItem = new GrabbedItem(item);
				this.element = grabbedItem;
				grabbedItem.move();
			}
		});
	}

	static remove() {
		grabbedItem = null;
		this.element = null;
	}

	static paint() {
		let tile = {};
		if (grabbedItem) {
			if (Tile.touchedTile) {
				tile = {
					x: (Tile.touchedTile.col + 1) * cam.pixelSize - cam.x,
					y:
						(Tile.touchedTile.row + 1) * cam.pixelSize -
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

	static element = null;
}
