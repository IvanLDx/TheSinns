import { Tile } from './Tile.js';
import { Modal } from './components/Modal.js';
import { ModalItem } from './Item/ModalItem.js';
import { GrabbedItem } from './Item/GrabbedItem.js';
import { WorldItem } from './Item/WorldItem.js';
import { SelfPlayer } from './SelfPlayer.js';

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
			ModalItem.createList(data.itemData);
			Modal.element.appendItems(ModalItem.list);
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
