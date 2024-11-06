import { LoginSocket } from './Socket/LoginSocket.js';
const loginSocket = LoginSocket.start();

const $form = document.querySelector('.login-form');

$form.onsubmit = (e) => {
	e.preventDefault();

	const formData = new FormData(e.target);
	const data = {};

	formData.forEach((value, key) => {
		data[key] = value;
	});

	loginSocket.signIn(data);
};
