const List = require('./List');
const World = require('./World');
const Socket = require('../Socket');
const itemData = require('../data/items');
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
			World.items.push(pack.grabbedItem);
			Socket.emit({ worldItems: World.items });
		});
	}

	static list = [];
}

module.exports = Player;
