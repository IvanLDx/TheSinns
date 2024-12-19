import { Tile } from './Tile.js';
import { Modal } from './components/Modal/Modal.js';
import { BurgerButton } from './components/BurgerMenu/BurgerButton.js';
import * as documentListeners from '../helpers/documentListeners.js';
import { ModalItem } from './Item/ModalItem.js';
import { GrabbedItem } from './Item/GrabbedItem.js';
import { WorldItem } from './Item/WorldItem.js';
import { SelfPlayer } from './SelfPlayer.js';
import { stage } from './Stage.js';

let worldItems = [];
let occupiedTiles = [];
let socket = null;

export class Socket {
	constructor() {
		this.init();
		this.positionEvents();
	}
	init() {
		socket = Socket.getLibrary();

		socket.on('selectWorld-OK', (data) => {
			stage.change('world');

			ModalItem.createList(data.itemData); // IMPORTANT! Create list before modal reset
			const interfaceElements = [Modal.reset(), BurgerButton.create()];
			cam.resizeInterface(interfaceElements);
			documentListeners.init();

			SelfPlayer.create(data.playerList, data.id);
			Tile.createList(data.world);

			const modal = Modal.getElement();
			modal.appendItems(ModalItem.list);
			modal.pagination.set();
		});

		socket.on('disconnect', (reason) => {
			stage.change('login');
			stage.sendDisconnectedMsg();
		});
	}

	positionEvents() {
		socket.on('newPosition', function (data) {
			occupiedTiles = data.occupiedTiles.map((e) => e.id);
			worldItems = WorldItem.create(data.worldItems, occupiedTiles);
		});

		socket.on('placeGrabbedItem-OK', function (data) {
			occupiedTiles = data.occupiedTiles.map((e) => e.id);
			worldItems = WorldItem.update(data.worldItems, occupiedTiles);
		});

		socket.on('removeItemFromWorld-OK', function (data) {
			if (data.tileToUpdate.some) {
				Tile.setOccupiedTile(occupiedTiles, data.tileToUpdate);
			} else {
				occupiedTiles.forEach((tileID, i) => {
					if (tileID === data.tileToUpdate.id) {
						occupiedTiles.splice(i, 1);
					}
				});
			}

			WorldItem.delete(data.itemToRemove);
		});

		socket.on('exitWorld-OK', () => {
			Modal.delete();
			BurgerButton.delete();
			documentListeners.stop();
			stage.change('menu');
		});
	}

	static saveWorld() {
		socket.emit('saveWorld', {
			worldItems: WorldItem.list
		});
	}

	static exitWorld() {
		socket.emit('exitWorld', {
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
		return this.get();
	}

	static get() {
		if (!this.instance) {
			this.instance = new Socket();
		}

		return this.instance;
	}

	static instance = null;

	static getLibrary() {
		if (!this.io) {
			this.io = io();
		}

		return this.io;
	}

	static io = null;
}
