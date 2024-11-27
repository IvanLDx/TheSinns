const fs = require('fs');
const Token = require('../scripts/Token');

class Login {
	constructor(id, socket) {
		this.id = id;
		this.socket = socket;
	}

	#csrfExpirationMsg() {
		this.socket.emit('csrfExpirationMsg', {
			expired: true
		});
	}

	initEvents() {
		const csrfToken = Token.create(this.id, () => this.#csrfExpirationMsg());
		this.socket.emit('login', {
			id: this.id,
			csrfToken: csrfToken.value
		});

		this.socket.on('signIn', (data) => {
			const token = Token.get(this.id);
			if (token.has(data.csrf_token) && data.honeypot === '') {
				token.restore();
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

					this.socket.emit('signIn-OK', responseToClient);
					this.socket.setToken();
				}
			} else {
				console.info('caca');
			}
		});
	}
}

module.exports = Login;
