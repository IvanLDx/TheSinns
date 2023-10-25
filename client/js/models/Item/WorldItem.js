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

	static create(worldItems) {
		this.list = {
			wall: [],
			wallElement: [],
			decoration: [],
			floor: []
		};

		utils.forEachType(worldItems, (worldItem) => {
			let item = new WorldItem(worldItem);
			this.list[item.type].push(item);
		});

		return this.list;
	}

	static paint() {
		utils.forEachType(this.list, (item) => {
			item.paint();
		});
	}

	static setPositionTile() {
		utils.forEachType(this.list, (item) => {
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
		let touchedItem = null;
		if (mouse.touchedTile) {
			utils.forEachObject(this.list, (listTypes) => {
				let thisItem = listTypes.find((item) => {
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
