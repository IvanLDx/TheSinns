const World = req('models/World');
const Player = req('models/Player');
const itemData = req('data/serverModalitems');

class UserMenu {
	constructor(socket, SocketClass) {
		this.id = socket.id;
		this.socket = socket;
		this.SocketClass = SocketClass;
	}

	initEvents() {
		this.socket.on('selectWorld', (data) => {
			const world = World.create(data.world);
			world.setMap();

			this.socket.setWorld(world);

			world.openMap(data.world.id).then(() => {
				this.socket.emit('newPosition', world.getPack());

				this.socket.emit('selectWorld-OK', {
					id: this.socket.id,
					itemData: itemData,
					playerList: Player.list,
					world: world.tiles
				});
			});
		});
	}
}

module.exports = UserMenu;
