import { Tile } from './Tile.js';
import { Modal } from './components/Modal/Modal.js';
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
			Modal.getElement().appendItems(ModalItem.list);
		});
	}

	newPosition() {
		socket.on('newPosition', function (data) {
			worldItems = WorldItem.create(data.worldItems);
			Object.entries(worldItems).forEach((worldItemTypes) => {
				worldItemTypes[1] = worldItemTypes[1].sort(function (a, b) {
					return a.touchedTile.row - b.touchedTile.row;
				});
			});
		});
	}

	static placeGrabbedItem() {
		socket.emit('placeGrabbedItem', {
			grabbedItem: GrabbedItem.element
		});
	}

	static removeItemFromWorld() {
		socket.emit('removeItemFromWorld', {
			item: WorldItem.selected
		});
	}

	static start() {
		new Socket();
	}
}
