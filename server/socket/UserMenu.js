const World = req('models/World');
const Player = req('models/Player');
const itemData = req('models/serverItem/itemData');
const basicCheck = req('scripts/basicCheck');
const IdentityCreation = req('scripts/IdentityCreation');
const FS = req('models/FS');

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

	createWorldData(formData, playerName) {
		const worldID = IdentityCreation.get().setValue({
			type: 'nameAndDate',
			name: formData['world-name']
		});

		let result = FS.writeWorld(worldID, []);

		if (result.success) {
			const playerData = FS.readAccount(playerName);

			const newWorld = {
				id: worldID,
				name: formData['world-name'],
				size: `${formData['world-width']}x${formData['world-height']}`
			};

			playerData.worlds.push(newWorld);
			result = FS.writeAccount(playerName, playerData);
			result.world = newWorld;
		}

		return result;
	}

	createWorldCheck(formData) {
		const result = basicCheck(this.socket.id, formData);

		if (result.error) {
			return result;
		}

		const checkedWorldName = formData['world-name'].trim().match(/^[a-zÀ-ÖØ-öø-ÿĀ-žẀ-ỹẞ0-9_.-](?: ?[a-zÀ-ÖØ-öø-ÿĀ-žẀ-ỹẞ0-9_.-])*$/i);
		if (!checkedWorldName) {
			result.error = true;
			result.message = `O nome do terreo soamente permite letras, números, espazos, puntos e os símbolos _ e -.`;
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
