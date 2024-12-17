const FS = req('models/FS');
const Token = req('scripts/Token');
const basicCheck = req('scripts/basicCheck');

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

		const passFile = FS.readHtpasswd().replaceAll('\r', '');

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
			result.message = 'Invalid credentials!';
			result.error = true;

			return result;
		}

		if (!result.error) {
			result.message = 'Token saved';
			result.success = true;

			this.socket.player.setName(user.username);

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

				this.socket.emit('signIn-OK', customerResult);
				this.socket.setToken();
			} else {
				console.trace('signIn:', customerResult.message);
			}
		});
	}
}

module.exports = Login;
