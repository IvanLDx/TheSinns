import { Tile } from './Tile.js';
import { Modal } from './components/Modal/Modal.js';
import { ModalItem } from './Item/ModalItem.js';
import { GrabbedItem } from './Item/GrabbedItem.js';
import { WorldItem } from './Item/WorldItem.js';
import { SelfPlayer } from './SelfPlayer.js';

let worldItems = [];
let occupiedTiles = [];
let socket = null;

export class Socket {
	constructor() {
		this.init();
		this.newPosition();
	}
	init() {
		socket = Socket.get();

		socket.on('selectWorld-OK', (data) => {
			SelfPlayer.create(data.playerList, data.id);
			Tile.createList(data.world);
			ModalItem.createList(data.itemData);
			const modal = Modal.getElement();
			modal.appendItems(ModalItem.list);
			modal.pagination.set();
		});
	}

	newPosition() {
		socket.on('newPosition', function (data) {
			occupiedTiles = data.occupiedTiles.map((e) => e.id);
			worldItems = WorldItem.create(data.worldItems, occupiedTiles);
		});
	}

	static saveWorld() {
		socket.emit('saveWorld', {
			worldItems: WorldItem.list
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

	static get() {
		if (!this.io) {
			this.io = io();
		}

		return this.io;
	}

	static io = null;
}
