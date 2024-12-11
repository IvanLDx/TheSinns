import { ifis } from '../utils.js';
import { stage } from '../models/Stage.js';
import { Socket } from '../models/Socket.js';
import * as menuHelpers from '../stages/menuHelpers.js';
const socket = Socket.getLibrary();

export class LoginSocket {
	constructor() {
		this.login();
	}
	login() {
		socket.on('login', (data) => {
			ifis(document.querySelector('.login-form .csrf-token'), ($csrfToken) => {
				$csrfToken.value = data.csrfToken;
			});
		});

		socket.on('csrfExpirationMsg', (data) => {
			if (data.expired) {
				document.querySelector('.expiration-msg').classList.add('show');
				stage.change('login');
			}
		});
	}

	signIn(data) {
		socket.off('signIn');
		socket.off('signIn-OK');

		socket.emit('signIn', data);

		socket.on('signIn-OK', (data) => {
			if (data.success) {
				stage.change('menu');
				menuHelpers.paintWorlds(data.worlds);
			}
		});
	}

	onRedirect() {
		socket.on('redirect', (data) => {
			window.location.href = data.url;
		});
	}

	static start() {
		return new LoginSocket();
	}
}
