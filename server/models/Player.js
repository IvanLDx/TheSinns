const fs = require('fs');
const List = require('./List');
const World = require('./World');
const Socket = require('../Socket');
const itemData = require('../data/serverModalitems');
class Player extends List {
	constructor(id) {
		super();
		this.x = 40;
		this.y = 40;
		this.w = 10;
		this.h = 10;
		this.id = id;

		Player.create(this);
	}

	static #getPack() {
		return {
			occupiedTiles: World.getOccupiedTiles(),
			worldItems: World.items
		};
	}

	static connect(socket) {
		new Player(socket.id);
		Socket.emit(this.#getPack());

		socket.emit('init', {
			id: socket.id,
			itemData: itemData,
			playerList: Player.list,
			world: World.tiles
		});

		socket.on('placeGrabbedItem', (pack) => {
			let tile = World.tiles.findByID(pack.grabbedItem.touchedTile.id);
			let grabbedItem = pack.grabbedItem;
			if (tile && !tile.isTypeOccupied(grabbedItem)) {
				World.placeItem(grabbedItem, tile);
				Socket.emit(this.#getPack());
			}
		});

		socket.on('saveWorld', (pack) => {
			let worldItems = JSON.stringify(pack.worldItems, null, 4);
			fs.writeFileSync('server/data/savedWorld.json', worldItems);
		});

		socket.on('removeItemFromWorld', (pack) => {
			World.tiles.findByID(pack.item.touchedTile.id, (tile) => {
				tile.occupied[pack.item.type] = false;
				tile.occupied.some = tile.isOccupied();
			});
			const itemType = World.items[pack.item.type];
			itemType.forEach((item, i) => {
				if (pack.item.id === item.id) {
					itemType.splice(i, 1);
				}
			});

			Socket.emit(this.#getPack());
		});
	}

	static list = [];
}

module.exports = Player;
