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
		this.worldID;

		this.login.initEvents();
		this.userMenu.initEvents();
	}

	#initOnEvents() {
		this.on('placeGrabbedItem', (pack) => {
			this.token.restore();
			let tile = this.world.findByID(pack.grabbedItem.touchedTile.id);
			let grabbedItem = pack.grabbedItem;
			if (tile && !tile.isTypeOccupied(grabbedItem)) {
				this.world.placeItem(grabbedItem, tile);
				Socket.emitWorldPosition(this.world.getPack());
			}
		});

		this.on('saveWorld', (pack) => {
			this.token.restore();
			if (this.worldID) {
				FS.writeWorld(this.worldID, pack.worldItems);
			}
		});

		this.on('removeItemFromWorld', (pack) => {
			this.token.restore();
			this.world.findByID(pack.item.touchedTile.id, (tile) => {
				tile.occupied[pack.item.type] = false;
				tile.occupied.some = tile.isOccupied();
			});
			const itemType = this.world.items[pack.item.type];
			itemType.forEach((item, i) => {
				if (pack.item.id === item.id) {
					itemType.splice(i, 1);
				}
			});

			Socket.emitWorldPosition(this.world.getPack());
		});
	}

	setToken() {
		this.token = Token.get(this.id);
	}

	setWorld(world) {
		this.world = world;
		return this.world;
	}

	setWorldID(worldID) {
		this.worldID = worldID;
	}

	emit(eventName, options) {
		this.self.emit(eventName, options);
	}

	on(eventName, callback) {
		this.self.on(eventName, (attr) => {
			callback(attr);
		});
	}

	static emitWorldPosition(pack) {
		Socket.each((socket) => {
			socket.self.emit('newPosition', pack);
		});
	}

	static create(socket) {
		const newSocket = new Socket(socket);
		Socket.list.push(newSocket);
	}

	static list = [];
}

module.exports = Socket;
