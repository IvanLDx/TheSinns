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
			const world = new World(data.world);
			world.setMap();

			this.socket.setWorldID(data.world.id);

			world.openMap(data.world.id).then(() => {
				this.socket.emit('newPosition', World.getPack());

				this.socket.emit('selectWorld-OK', {
					id: this.socket.id,
					itemData: itemData,
					playerList: Player.list,
					world: World.tiles
				});
			});
		});
	}
}

module.exports = UserMenu;
