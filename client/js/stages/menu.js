import { Socket } from '../models/Socket.js';
import * as menuHelpers from './menuHelpers.js';
import { utils } from '../utils.js';
import { $ } from '../dom.js';
let initialized = false;
let socket;

function initNewWorldCreation() {
	const $form = $('.new-world-form');

	$form.onsubmit = (e) => {
		e.preventDefault();

		const formData = utils.convertFormDataToObject($form);
		socket.emit('createWorld', formData);
	};

	socket.on('createWorld-FAIL', (res) => {
		const $errorMsg = $form.find('.error-msg');
		$errorMsg.textContent = res.message;
		$errorMsg.addClass('show');
	});

	const $cancelBtn = $('.world-cancel');
	$cancelBtn.onclick = menuHelpers.closeWorldEditForm;
}

function initializeSocket() {
	socket = Socket.getLibrary();
	initNewWorldCreation();

	menuHelpers.onClickWorldSheet((e, $worldSheet) => {
		switch ($worldSheet.getAttribute('data-type')) {
			case 'new':
				$worldSheet.addClass('edit');
				break;
			default:
				const world = {
					id: $worldSheet.getAttribute('data-id'),
					size: $worldSheet.getAttribute('data-size')
				};
				socket.emit('selectWorld', { world: world });
				break;
		}
	});

	initialized = true;
}

if (!initialized) {
	initializeSocket();
}
