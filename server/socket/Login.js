const FS = req('models/FS');
const Token = req('scripts/Token');
const basicCheck = req('scripts/basicCheck');
const itemData = req('models/serverItem/itemData');

class Login {
	constructor(socket) {
		this.id = socket.id;
		this.socket = socket;
	}

	#csrfExpirationMsg() {
		this.socket.emit('csrfExpirationMsg', {
			expired: true
		});
	}

	customerExists(data) {
		const result = basicCheck(this.id, data);

		if (result.error) {
			return result;
		}

		if (!data.username || !data.password) {
			result.message = 'Fill all the fields';
			result.error = true;

			return result;
		}

		const users = FS.readHtpasswd();

		const user = users.find((user) => user.email === data.username);
		if (!user) {
			result.isSlotFree = true;
		} else {
			result.error = true;
			result.message = 'The account arleady exists, please login.';
		}
		return result;
	}

	checkCustomer(data) {
		const result = basicCheck(this.id, data);

		if (result.error) {
			return result;
		}

		if (!data.username || !data.password) {
			result.message = 'Fill all the fields';
			result.error = true;

			return result;
		}

		const users = FS.readHtpasswd();

		const user = users.find((user) => user.email === data.username);
		if (!user || user.password !== data.password) {
			result.message = 'Invalid credentials!';
			result.error = true;

			return result;
		}

		if (!result.error) {
			result.message = 'Token saved';
			result.success = true;

			this.socket.player.setName(user.email);

			return result;
		}
	}

	initEvents() {
		const csrfToken = Token.create(this.id, () => this.#csrfExpirationMsg());
		this.socket.emit('login', {
			id: this.id,
			csrfToken: csrfToken.value
		});

		this.socket.on('signIn', (data) => {
			const customerResult = this.checkCustomer(data);

			if (customerResult.success) {
				customerResult.socket = this.socket.player;
				const account = FS.readAccount(data.username);
				customerResult.worlds = account.worlds;
				customerResult.itemData = itemData;

				this.socket.emit('signIn-OK', customerResult);
				this.socket.setToken();
			} else {
				console.trace('signIn:', customerResult.message);
				this.socket.emit('signIn-FAIL', customerResult);
			}
		});

		this.socket.on('signUp', (data) => {
			let customerResult = this.customerExists(data);

			if (customerResult.isSlotFree) {
				customerResult = FS.createAccount(data.username);
				customerResult.socket = this.socket.player;
				this.socket.player.setName(data.username);
			}
			if (customerResult.success) {
				customerResult = FS.writeHtpasswd(data);
				customerResult.worlds = [];
			}

			if (customerResult.success) {
				this.socket.emit('signUp-OK', customerResult);
				this.socket.setToken();
			}

			if (customerResult.error) {
				console.trace('signUp:', customerResult);
				this.socket.emit('signUp-FAIL', customerResult);
			}
		});
	}
}

module.exports = Login;
