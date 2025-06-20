import { ifis } from '../utils.js';
import { stage } from '../models/Stage.js';
import { Socket } from '../models/Socket.js';
import { ItemMgr } from '../models/Item/ItemMgr.js';
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

			ifis(document.querySelector('.new-world-form .csrf-token'), ($csrfToken) => {
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
		socket.off('signIn-FAIL');

		socket.emit('signIn', data);

		socket.on('signIn-OK', (data) => {
			if (data.success) {
				stage.change('menu');
				ItemMgr.set(data.itemData);
				menuHelpers.paintWorlds(data.worlds);
			}
		});

		socket.on('signIn-FAIL', (data) => {
			if (data.error && data.message) {
				const $formError = $('.login-form .error-msg');
				$formError.textContent = data.message;
				$formError.addClass('show');
			}
		});
	}

	signUp(data) {
		socket.off('signUp');
		socket.off('signUp-OK');
		socket.off('signUp-FAIL');

		socket.emit('signUp', data);

		socket.on('signUp-OK', (data) => {
			if (data.success) {
				stage.change('menu');
				menuHelpers.paintWorlds(data.worlds);
			}
		});

		socket.on('signUp-FAIL', (data) => {
			if (data.error && data.message) {
				const $formError = $('.login-form .error-msg');
				$formError.textContent = data.message;
				$formError.addClass('show');
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
