import { Tile } from './Tile.js';
import { Item } from './components/Item.js';
import { Entity } from './Entity.js';
import { SelfPlayer } from './SelfPlayer.js';
import { WorldItem } from './WorldItem.js';

const socket = io();
let worldItems = [];

export class Socket {
	constructor() {
		this.init();
		this.newPosition();
	}
	init() {
		socket.on('init', (data) => {
			SelfPlayer.create(data.playerList, data.id);
			Tile.createList(data.world);
			Item.createList(data.itemData);
			Entity.itemsModal.appendItems(Item.list);
		});
	}

	newPosition() {
		socket.on('newPosition', function (data) {
			Tile.handleTouch(data, Item.grabbed);
			if (worldItems && worldItems.length !== data.worldItems.length) {
				worldItems = WorldItem.create(data.worldItems);
				worldItems = worldItems.sort(function (a, b) {
					return a.touchedTile.row - b.touchedTile.row;
				});
			}
		});
	}

	static placeGrabbedItem() {
		socket.emit('placeGrabbedItem', {
			grabbedTile: Item.grabbed
		});
	}

	static start() {
		new Socket();
	}
}
