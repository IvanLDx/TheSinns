const fs = require('fs');
const token = require('../scripts/Token').get();

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
		this.socket.emit('login', {
			id: this.id,
			csrfToken: token.create(this.id, () => this.#csrfExpirationMsg())
		});

		this.socket.on('signIn', (data) => {
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

					this.socket.emit('signIn-OK', responseToClient);
				}
			} else {
				console.info('caca');
			}
		});
	}
}

module.exports = Login;
