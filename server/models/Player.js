const Entity = require('./Entity');
const World = require('./World');
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
			playerList: Player.list,
			world: World.tiles
		});

		socket.on('sendToServer', (pack) => {
			player.setMousePosition(pack);
			World.setTouchedTile(pack);
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
