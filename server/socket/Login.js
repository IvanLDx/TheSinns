const fs = require('fs');
const Token = require('../scripts/Token');

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
		const token = Token.get(this.id);
		const result = {};
		if (!token.has(data.csrf_token) || data.honeypot !== '') {
			result.message = 'Token is expired';
			result.error = true;

			return result;
		}

		token.restore();

		if (!data.username || !data.password) {
			result.message = 'Fill all the fields';
			result.error = true;

			return result;
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
				this.socket.emit('signIn-OK', customerResult);
				this.socket.setToken();
			} else {
				console.info('signIn:', customerResult.message);
			}
		});
	}
}

module.exports = Login;
