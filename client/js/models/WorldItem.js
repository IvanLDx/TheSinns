import { helpers } from '../helpers.js';

export class WorldItem {
	constructor(worldItem) {
		this.type = 'worldItem';
		this.id = worldItem.id;
		this.w = worldItem.w;
		this.h = worldItem.h;
		this.name = worldItem.name;
		this.touchedTile = worldItem.touchedTile;
		this.rotation = worldItem.rotation;
		this.image = helpers.getImage(this.name);
	}

	static create(worldItems) {
		this.list = [];
		worldItems.forEach((worldItem) => {
			let item = new WorldItem(worldItem);
			this.list.push(item);
		});

		return this.list;
	}

	static paint() {
		this.list.forEach((item) => {
			ctx.drawImage(
				item.image,
				item.rotation * item.w,
				0,
				item.w,
				item.h,
				(item.touchedTile.col + 1) * cam.pixelSize - cam.x,
				(item.touchedTile.row + 1) * cam.pixelSize -
					cam.y -
					(item.h - 10) * cam.pixelSize,
				(item.w - 2) * cam.pixelSize + cam.pixelSize * 2,
				(item.h - 1) * cam.pixelSize + cam.pixelSize
			);
		});
	}

	static list = [];
}
