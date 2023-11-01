import { Item } from './Item.js';
import { Socket } from '../Socket.js';
import { utils } from '../../utils.js';

export class WorldItem extends Item {
	constructor(worldItem) {
		super(worldItem);
		this.locationType = 'WorldItem';
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

	static create(worldItems, occupiedTiles) {
		this.list = [];
		occupiedTiles.sort((a, b) => {
			return a.split('-')[0] < b.split('-')[0];
		});

		occupiedTiles.forEach((tile) => {
			utils.forEachObject(worldItems, (itemTypes, type) => {
				itemTypes.forEach((item, i) => {
					if (tile === item.touchedTile.id) {
						this.list.push(new WorldItem(item));
						worldItems[type].splice(i, 1);
					}
				});
			});
		});

		return this.list;
	}

	static paint() {
		this.each((item) => {
			item.paint();
		});
	}

	static setPositionTile() {
		this.each((item) => {
			item.setPositionTile();
		});
	}

	static removeItem() {
		Socket.removeItemFromWorld();
		this.unselectItem();
	}

	static unselectItem() {
		this.selected = null;
	}

	static tryToSelect() {
		if (mouse.touchedTile) {
			this.selected = this.list.find((item) => {
				return mouse.touchedTile.id === item.touchedTile.id;
			});
		}
		return this.selected;
	}

	static selected = null;

	static list = [];
}
