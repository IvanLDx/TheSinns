const FS = req('models/FS');
const List = req('models/List');
const Player = req('models/Player');
const Login = req('socket/Login');
const UserMenu = req('socket/UserMenu');
const Token = req('scripts/Token');

class Socket extends List {
	constructor(socket) {
		super();
		this.id = socket.id;
		this.self = socket;
		this.player = new Player(socket.id);
		this.login = new Login(this);
		this.userMenu = new UserMenu(this, Socket);
		this.#initOnEvents();
		this.token = null;
		this.world = null;

		this.login.initEvents();
		this.userMenu.initEvents();
	}

	#restoreToken() {
		if (this.token) {
			this.token.restore();
		}
	}

	#saveWorld(worldItems) {
		this.#restoreToken();
		if (this.world && this.world.id) {
			FS.writeWorld(this.world.id, worldItems);
		}
	}

	#initOnEvents() {
		this.on('placeGrabbedItem', (pack) => {
			this.#restoreToken();
			if (this.world) {
				let tile = this.world.findByID(pack.grabbedItem.touchedTile.id);
				let grabbedItem = pack.grabbedItem;
				if (tile && !tile.isCategoryOccupied(grabbedItem)) {
					this.world.placeItem(grabbedItem, tile);
					this.self.emit('newPosition', this.world.getPack());
				}
			}
		});

		this.on('saveWorld', (pack) => {
			this.#saveWorld(pack.worldItems);
		});

		this.on('exitWorld', (pack) => {
			this.#saveWorld(pack.worldItems);
			this.world = null;
			this.emit('exitWorld-OK');
		});

		this.on('removeItemFromWorld', (pack) => {
			this.#restoreToken();

			if (this.world) {
				const tileToUpdate = this.world.findByID(pack.item.touchedTile.id, (tile) => {
					tile.occupied[pack.item.category] = false;
					tile.occupied.some = tile.isOccupied();
				});
				const itemCategoryButton = this.world.items[pack.item.category];
				itemCategoryButton.forEach((item, i) => {
					if (pack.item.id === item.id) {
						itemCategoryButton.splice(i, 1);
					}
				});

				this.removeItemFromWorldOK({
					item: pack.item,
					tileToUpdate: tileToUpdate
				});
			}
		});

		this.on('createWorld', (formData) => {
			let result = this.userMenu.createWorldCheck(formData);

			if (result.success) {
				result = this.userMenu.createWorldData(formData, this.player.name);
			}

			if (result.error) {
				this.emit('createWorld-FAIL', result);
			} else {
				this.emit('createWorld-OK', result);
			}
		});
	}

	setToken() {
		this.token = Token.get(this.id);
	}

	setWorld(world) {
		this.world = world;
		return this.world;
	}

	emit(eventName, options) {
		this.self.emit(eventName, options);
	}

	on(eventName, callback) {
		this.self.on(eventName, (attr) => {
			callback(attr);
		});
	}

	emitNewPosition() {
		this.self.emit('newPosition', this.world.getPack());
	}

	removeItemFromWorldOK(pack) {
		const tileToUpdateLite = this.world.getTileToUpdateLite(pack.tileToUpdate);

		this.self.emit('removeItemFromWorld-OK', {
			tileToUpdate: tileToUpdateLite,
			itemToRemove: pack.item.id
		});
	}

	requestWorldToSave() {
		this.self.emit('requestWorldToSave');
		this.self.on('requestWorldToSave-OK', (pack) => {
			this.#saveWorld(pack.worldItems);
		});
	}

	emitUpdatePosition(pack) {
		const tileToUpdate = {
			id: pack.tileToUpdate.id,
			occupied: pack.tileToUpdate.occupied
		};

		this.self.emit('removeTileItemPosition', {
			tileToUpdate: tileToUpdate,
			itemToRemove: pack.item.id
		});
	}

	static create(socket) {
		const newSocket = new Socket(socket);
		super.create(newSocket);
	}
}

module.exports = Socket;
