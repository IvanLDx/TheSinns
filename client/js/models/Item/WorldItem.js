import { Item } from './Item.js';
import { Socket } from '../Socket.js';

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

	static create(worldItems) {
		this.list = {
			wall: [],
			wallElement: [],
			decoration: [],
			floor: []
		};

		//
		//
		//
		// Convertir OBJECT entry en custom forEach
		Object.entries(worldItems).forEach((itemTypes) => {
			itemTypes[1].forEach((worldItem) => {
				let item = new WorldItem(worldItem);
				this.list[item.type].push(item);
			});
		});

		return this.list;
	}

	static paint() {
		Object.entries(this.list).forEach((listTypes) => {
			listTypes[1].forEach((item) => {
				item.paint();
			});
		});
	}

	static setPositionTile() {
		Object.entries(this.list).forEach((listTypes) => {
			listTypes[1].forEach((item) => {
				item.setPositionTile();
			});
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
		let touchedItem = null;
		if (mouse.touchedTile) {
			Object.entries(this.list).forEach((listTypes) => {
				let thisItem = listTypes[1].find((item) => {
					return mouse.touchedTile.id === item.touchedTile.id;
				});
				if (thisItem) {
					touchedItem = thisItem;
				}
			});

			if (touchedItem) {
				this.selected = touchedItem;
			}
		}
		return touchedItem;
	}

	static selected = null;

	static list = [];
}
