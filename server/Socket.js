const fs = require('fs');
const List = require('./models/List');
const Player = require('./models/Player');
const World = require('./models/World');
const itemData = require('./data/serverModalitems');

class Socket extends List {
	constructor(socket) {
		super();
		this.id = socket.id;
		this.self = socket;
		this.player = new Player(socket.id);
		this.#initOnEvents();
		this.#initEmitEvents();
	}

	#initOnEvents() {
		this.on('placeGrabbedItem', (pack) => {
			let tile = World.findByID(pack.grabbedItem.touchedTile.id);
			let grabbedItem = pack.grabbedItem;
			if (tile && !tile.isTypeOccupied(grabbedItem)) {
				World.placeItem(grabbedItem, tile);
				Socket.emitWorldPosition(World.getPack());
			}
		});

		this.on('saveWorld', (pack) => {
			let worldItems = JSON.stringify(pack.worldItems, null, 4);
			fs.writeFileSync('server/data/savedWorld.json', worldItems);
		});

		this.on('removeItemFromWorld', (pack) => {
			World.findByID(pack.item.touchedTile.id, (tile) => {
				tile.occupied[pack.item.type] = false;
				tile.occupied.some = tile.isOccupied();
			});
			const itemType = World.items[pack.item.type];
			itemType.forEach((item, i) => {
				if (pack.item.id === item.id) {
					itemType.splice(i, 1);
				}
			});

			Socket.emitWorldPosition(World.getPack());
		});
	}

	#initEmitEvents() {
		this.emit('init', {
			id: this.self.id,
			itemData: itemData,
			playerList: Player.list,
			world: World.tiles
		});
	}

	emit(eventName, options) {
		this.self.emit(eventName, options);
	}

	on(eventName, callback) {
		this.self.on(eventName, (attr) => {
			callback(attr);
		});
	}

	static emitWorldPosition(pack) {
		Socket.each((socket) => {
			socket.self.emit('newPosition', pack);
		});
	}

	static create(socket) {
		const newSocket = new Socket(socket);
		Socket.list.push(newSocket);
		Socket.emitWorldPosition(World.getPack());
	}

	static list = [];
}

module.exports = Socket;
