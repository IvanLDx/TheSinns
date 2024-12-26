import { LoginSocket } from '../Socket/LoginSocket.js';
const loginSocket = LoginSocket.start();

const $form = document.querySelector('.login-form');
let $errorMsg = null;

$form.onsubmit = (e) => {
	e.preventDefault();

	const formData = new FormData(e.target);
	const data = {};

	formData.forEach((value, key) => {
		data[key] = value;
	});

	const $submitter = $(e.submitter);
	if ($submitter.hasClass('submit')) {
		loginSocket.signIn(data);
	} else if ($submitter.hasClass('signup')) {
		loginSocket.signUp(data);
	}
};

$form.onclick = () => {
	if (!$errorMsg) {
		$errorMsg = $('.login-form .error-msg');
	}

	$errorMsg.removeClass('show');
};

document.querySelector('.refresh').onclick = () => {
	location.reload();
};
