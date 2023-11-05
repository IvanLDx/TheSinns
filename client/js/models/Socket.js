import { Tile } from './Tile.js';
import { Modal } from './components/Modal/Modal.js';
import { ModalItem } from './Item/ModalItem.js';
import { GrabbedItem } from './Item/GrabbedItem.js';
import { WorldItem } from './Item/WorldItem.js';
import { SelfPlayer } from './SelfPlayer.js';
import { utils } from '../utils.js';

const socket = io();
let worldItems = [];
let occupiedTiles = [];

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
			occupiedTiles = data.occupiedTiles.map((e) => e.id);
			worldItems = WorldItem.create(data.worldItems, occupiedTiles);
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
