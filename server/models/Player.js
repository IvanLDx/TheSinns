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
		let player = new Player(socket.id);

		socket.emit('init', {
			id: socket.id,
			itemData: itemData,
			playerList: Player.list,
			world: World.tiles
		});

		socket.on('sendToServer', (pack) => {
			player.setMousePosition(pack);
			World.setTouchedTile(pack);
		});

		socket.on('placeGrabbedItem', (pack) => {
			World.items.push(pack.grabbedTile);
		});
	}
	static update() {
		let pack = [];
		Player.each((player) => {
			pack.push({
				x: player.x,
				y: player.y
			});
		});
		return pack;
	}
}

module.exports = Player;
