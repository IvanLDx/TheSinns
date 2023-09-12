import { Tile } from './Tile.js';
import { Modal } from './components/Modal.js';
import { Item } from './components/Item.js';
import { GrabbedItem } from './components/GrabbedItem.js';
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
			Modal.element.appendItems(Item.list);
		});
	}

	newPosition() {
		socket.on('newPosition', function (data) {
			worldItems = WorldItem.create(data.worldItems);
			worldItems = worldItems.sort(function (a, b) {
				return a.touchedTile.row - b.touchedTile.row;
			});
		});
	}

	static placeGrabbedItem() {
		socket.emit('placeGrabbedItem', {
			grabbedItem: GrabbedItem.element
		});
	}

	static start() {
		new Socket();
	}
}
