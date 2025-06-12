import { Item } from './Item.js';
import { Socket } from '../Socket.js';
import { utils } from '../../utils.js';

export class WorldItem extends Item {
	constructor(worldItem) {
		super(worldItem);
		this.locationType = 'WorldItem';
		this.id = worldItem.id;
		this.touchedTile = worldItem.touchedTile;
		this.touchedItems = [];
		this.position = this.setPositionTile();
		this.destinationY = null;
		this.touchedByMouse = false;
	}

	setPositionTile() {
		this.position = {
			x: (this.touchedTile.col + 1) * cam.pixelSize - cam.x,
			y: (this.touchedTile.row + 1) * cam.pixelSize - cam.y - (this.h - 10) * cam.pixelSize,
			w: (this.w - 2) * cam.pixelSize + cam.pixelSize * 2,
			h: (this.h - 1) * cam.pixelSize + cam.pixelSize
		};

		return this.position;
	}

	static create(worldItems, occupiedTiles) {
		WorldItem.list = [];
		occupiedTiles.sort((a, b) => {
			return a.split('-')[0] < b.split('-')[0];
		});

		occupiedTiles.forEach((tile) => {
			utils.forEachObject(worldItems, (itemCategoryButton, category) => {
				itemCategoryButton.forEach((item, i) => {
					if (tile === item.touchedTile.id) {
						WorldItem.push(item);
						worldItems[category].splice(i, 1);
					}
				});
			});
		});

		return WorldItem.list;
	}

	static push(item) {
		return super.push(new WorldItem(item));
	}

	static paint() {
		WorldItem.each((item) => {
			item.paint();
		});
	}

	static setPositionTile() {
		WorldItem.sort((a, b) => {
			return b.touchedTile.colID - a.touchedTile.colID;
		});

		WorldItem.each((item) => {
			item.setPositionTile();
			item.destinationY = utils.getDestinationYByCategory(item.position.y, item.position.h, item.category);
		});
	}

	static removeItem() {
		Socket.removeItemFromWorld();
		WorldItem.unselectItem();
	}

	static selectItem(item) {
		WorldItem.selected = item;
	}

	static unselectItem() {
		WorldItem.selected = null;
	}

	static getAboveItem() {
		let aboveItem = WorldItem.touchedItems.find((item) => {
			return item.category === 'decoration';
		});
		if (!aboveItem) {
			aboveItem = WorldItem.touchedItems.find((item) => {
				return item.category === 'wallElement';
			});
		}
		if (!aboveItem) {
			aboveItem = WorldItem.touchedItems.find((item) => {
				return item.category === 'roof';
			});
		}
		if (!aboveItem) {
			aboveItem = WorldItem.touchedItems.find((item) => {
				return item.category === 'wall';
			});
		}
		if (!aboveItem) {
			aboveItem = WorldItem.touchedItems.find((item) => {
				return item.category === 'floor';
			});
		}
		return aboveItem;
	}

	static tryToSelect() {
		if (mouse.touchedTile) {
			WorldItem.touchedItems = WorldItem.filter((item) => {
				return mouse.touchedTile.id === item.touchedTile.id;
			});
			WorldItem.selectItem(WorldItem.getAboveItem());
		}
		return WorldItem.selected;
	}

	static getItemByID(id) {
		return WorldItem.find((item) => {
			return item.id === id;
		});
	}

	static untouchItems() {
		WorldItem.touchedItems = [];
	}

	static getList() {
		const list = super.getList().map((item) => {
			return {
				x: item.x,
				y: item.y,
				w: item.w,
				h: item.h,
				category: item.category,
				url: item.url,
				name: item.name,
				rotation: item.rotation,
				id: item.id,
				touchedTile: item.touchedTile
			};
		});

		return list;
	}

	static selected = null;
}
