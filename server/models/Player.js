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

	static connect(socket) {
		new Player(socket.id);
		Socket.emit({ worldItems: World.items });

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
				World.items[grabbedItem.type].push(grabbedItem);
				Socket.emit({ worldItems: World.items });
				tile.occupied[grabbedItem.type] = true;
			}
		});

		socket.on('removeItemFromWorld', (pack) => {
			World.tiles.findByID(pack.item.touchedTile.id, (tile) => {
				tile.occupied[pack.item.type] = false;
			});
			Object.entries(World.items).forEach((itemTypes) => {
				itemTypes[1].forEach((item, i) => {
					if (pack.item.id === item.id) {
						itemTypes[1].splice(i, 1);
					}
				});
			});
			Socket.emit({ worldItems: World.items });
		});
	}

	static list = [];
}

module.exports = Player;
