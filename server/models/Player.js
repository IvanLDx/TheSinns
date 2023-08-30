const Entity = require('./Entity');
const World = require('./World');
const itemData = require('../data/items');
class Player extends Entity {
	constructor(id) {
		super();
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
			World.items.push(pack.grabbedTile);
		});
	}
}

module.exports = Player;
