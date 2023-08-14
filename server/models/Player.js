const Entity = require('./Entity');
const World = require('./World');
const world = new World();
class Player extends Entity {
	constructor(id) {
		super();
		this.id = id;
		this.pressingRight = false;
		this.pressingLeft = false;
		this.pressingUp = false;
		this.pressingDown = false;
		this.maxSpd = 2;

		let super_update = this.update;
		this.update = function () {
			this.updateSpd();
			super_update();
		};

		this.updateSpd = function () {
			if (this.pressingRight) this.spdX = this.maxSpd;
			else if (this.pressingLeft) this.spdX = -this.maxSpd;
			else this.spdX = 0;

			if (this.pressingUp) this.spdY = -this.maxSpd;
			else if (this.pressingDown) this.spdY = this.maxSpd;
			else this.spdY = 0;
		};
		Player.create(this);
	}
	static connect(socket) {
		let player = new Player(socket.id);

		socket.on('keyPress', function (data) {
			if (data.inputId === 'left') player.pressingLeft = data.state;
			else if (data.inputId === 'right')
				player.pressingRight = data.state;
			else if (data.inputId === 'up') player.pressingUp = data.state;
			else if (data.inputId === 'down') player.pressingDown = data.state;
		});

		socket.emit('init', {
			id: socket.id,
			playerList: Player.list,
			world: world
		});
	}
	static update() {
		let pack = [];
		Player.each((player) => {
			player.update();
			pack.push({
				x: player.x,
				y: player.y
			});
		});
		return pack;
	}
}

module.exports = Player;
