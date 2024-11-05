const socket = io();
import { ifis } from '../utils.js';
import { Modal } from '../models/components/Modal/Modal.js';
import { BurgerButton } from '../models/components/BurgerMenu/BurgerButton.js';

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
			}
		});
	}

	signIn(data) {
		socket.emit('signIn', data);

		socket.on('signIn-OK', (data) => {
			if (data.success) {
				document.querySelector('.canvas').classList.add('show');

				const interfaceElements = [Modal.create(), BurgerButton.create()];
				cam.resizeInterface(interfaceElements);
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
