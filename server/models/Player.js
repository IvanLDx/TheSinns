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

	setMousePosition(pack) {
		this.x += pack.mouse.drag.x;
		this.y += pack.mouse.drag.y;
	}

	static connect(socket) {
		new Player(socket.id);

		socket.emit('init', {
			id: socket.id,
			itemData: itemData,
			playerList: Player.list,
			world: World.tiles
		});

		socket.on('placeGrabbedItem', (pack) => {
			let tile = World.tiles.findByID(pack.grabbedItem.touchedTile.id);
			if (tile && !tile.occupied) {
				World.items.push(pack.grabbedItem);
				Socket.emit({ worldItems: World.items });
				tile.occupied = true;
			}
		});

		socket.on('removeItemFromWorld', (pack) => {
			World.tiles.findByID(pack.item.touchedTile.id, (tile) => {
				delete tile.occupied;
			});
			World.items.forEach((item, i) => {
				if (pack.item.id === item.id) {
					World.items.splice(i, 1);
				}
			});
			Socket.emit({ worldItems: World.items });
		});
	}

	static list = [];
}

module.exports = Player;
