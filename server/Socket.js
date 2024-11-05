const fs = require('fs');
const List = require('./models/List');
const Player = require('./models/Player');
const World = require('./models/World');
const itemData = require('./data/serverModalitems');
const token = require('./scripts/Token').get();

class Socket extends List {
	constructor(socket) {
		super();
		this.id = socket.id;
		this.self = socket;
		this.token = this.player = new Player(socket.id);
		this.#initOnEvents();
		this.#initEmitEvents();
		this.#login();
	}

	#initOnEvents() {
		this.on('placeGrabbedItem', (pack) => {
			let tile = World.findByID(pack.grabbedItem.touchedTile.id);
			let grabbedItem = pack.grabbedItem;
			if (tile && !tile.isTypeOccupied(grabbedItem)) {
				World.placeItem(grabbedItem, tile);
				Socket.emitWorldPosition(World.getPack());
			}
		});

		this.on('saveWorld', (pack) => {
			let worldItems = JSON.stringify(pack.worldItems, null, 4);
			fs.writeFileSync('server/data/savedWorld.json', worldItems);
		});

		this.on('removeItemFromWorld', (pack) => {
			World.findByID(pack.item.touchedTile.id, (tile) => {
				tile.occupied[pack.item.type] = false;
				tile.occupied.some = tile.isOccupied();
			});
			const itemType = World.items[pack.item.type];
			itemType.forEach((item, i) => {
				if (pack.item.id === item.id) {
					itemType.splice(i, 1);
				}
			});

			Socket.emitWorldPosition(World.getPack());
		});
	}

	#initEmitEvents() {
		this.emit('init', {
			id: this.self.id,
			itemData: itemData,
			playerList: Player.list,
			world: World.tiles
		});
	}

	#csrfExpirationMsg() {
		this.emit('csrfExpirationMsg', {
			expired: true
		});
	}

	#login() {
		this.emit('login', {
			id: this.id,
			csrfToken: token.create(this.id, () => this.#csrfExpirationMsg())
		});

		this.on('signIn', (data) => {
			const selfToken = token.get(this.id);
			if (selfToken.has(data.csrf_token) && data.honeypot === '') {
				const responseToClient = {};

				if (!data.username || !data.password) {
					responseToClient.message = 'Fill all the fields';
					responseToClient.error = true;
				}

				const passFile = fs
					.readFileSync('../.htpasswds/.theSinnsHtpasswd', {
						encoding: 'utf-8'
					})
					.replaceAll('\r', '');

				const usersRaw = passFile.split('\n');

				const users = usersRaw.map((user) => {
					const creds = user.split(':');
					return {
						username: creds[0],
						password: creds[1]
					};
				});

				const user = users.find((user) => user.username === data.username);
				if (!user || user.password !== data.password) {
					responseToClient.message = 'Invalid credentials!';
					responseToClient.error = true;
				}

				if (!responseToClient.error) {
					responseToClient.message = 'Token saved';
					responseToClient.success = true;

					this.emit('signIn-OK', responseToClient);
				}
			} else {
				console.info('caca');
			}
		});
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
		Socket.emitWorldPosition(World.getPack());
	}

	static list = [];
}

module.exports = Socket;
