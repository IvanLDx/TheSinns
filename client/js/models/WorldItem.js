import { helpers } from '../helpers.js';

export class WorldItem {
	constructor(worldItem) {
		this.id = worldItem.id;
		this.w = worldItem.w;
		this.h = worldItem.h;
		this.name = worldItem.name;
		this.touchedTile = worldItem.touchedTile;
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
				helpers.getImage(item.name),
				0,
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
