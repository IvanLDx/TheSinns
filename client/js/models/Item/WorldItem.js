import { Item } from './Item.js';

export class WorldItem extends Item {
	constructor(worldItem) {
		super(worldItem);
		this.type = 'WorldItem';
		this.id = worldItem.id;
		this.touchedTile = worldItem.touchedTile;
		this.setPositionTile();
	}

	setPositionTile() {
		this.position = {
			x: (this.touchedTile.col + 1) * cam.pixelSize - cam.x,
			y:
				(this.touchedTile.row + 1) * cam.pixelSize -
				cam.y -
				(this.h - 10) * cam.pixelSize,
			w: (this.w - 2) * cam.pixelSize + cam.pixelSize * 2,
			h: (this.h - 1) * cam.pixelSize + cam.pixelSize
		};
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
			item.paint();
		});
	}

	static setPositionTile() {
		this.list.forEach((item) => {
			item.setPositionTile();
		});
	}

	static list = [];
}
