const World = req('models/World');
const Player = req('models/Player');
const itemData = req('data/serverModalitems');
const basicCheck = req('scripts/basicCheck');

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

	createWorld(formData) {
		const result = basicCheck(this.socket.id, formData);

		if (result.error) {
			return result;
		}

		const checkedWorldName = formData['world-name'].trim().match(/^[a-zÀ-ÖØ-öø-ÿĀ-žẀ-ỹẞ0-9_.-](?: ?[a-zÀ-ÖØ-öø-ÿĀ-žẀ-ỹẞ0-9_.-])*$/i);
		if (!checkedWorldName) {
			result.error = true;
			result.message = `World name doesn't match the pattern`;
			return result;
		}

		const checkedRangeInputs = basicCheck.checkRangeInputs(formData['world-width'], formData['world-height']);
		if (!checkedRangeInputs) {
			result.error = true;
			result.message = `Range inputs doesn't match the expected range`;
			return result;
		}

		result.success = true;
		return result;
	}
}

module.exports = UserMenu;
