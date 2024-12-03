const socket = window.socket;
import { ifis } from '../utils.js';
import { Modal } from '../models/components/Modal/Modal.js';
import { BurgerButton } from '../models/components/BurgerMenu/BurgerButton.js';
import * as documentListeners from '../helpers/documentListeners.js';
import { stage } from '../models/Stage.js';

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
		socket.emit('signIn', data);

		socket.on('signIn-OK', (data) => {
			if (data.success) {
				stage.change('menu');
			}
		});

		socket.on('enterWorld', (data) => {
			if (data.success) {
				stage.change('world');

				const interfaceElements = [Modal.create(), BurgerButton.create()];
				cam.resizeInterface(interfaceElements);

				documentListeners.init();
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
