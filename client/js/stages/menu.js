import { Socket } from '../models/Socket.js';
import * as menuHelpers from './menuHelpers.js';
import { utils } from '../utils.js';
import { $ } from '../dom.js';
let initialized = false;
let socket;

function initRangeInputEvents() {
	const $worldWidth = {
		input: $('[name=world-width]'),
		value: $('.world-width-value')
	};

	const $worldHeight = {
		input: $('[name=world-height]'),
		value: $('.world-height-value')
	};

	$worldWidth.value.textContent = $worldWidth.input.value;
	$worldHeight.value.textContent = $worldHeight.input.value;

	$worldWidth.input.addEventListener('input', (e) => {
		$worldWidth.value.textContent = e.target.value;
	});

	$worldHeight.input.addEventListener('input', (e) => {
		$worldHeight.value.textContent = e.target.value;
	});
}

function initNewWorldCreation() {
	const $form = $('.new-world-form');
	initRangeInputEvents();

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

	socket.on('createWorld-OK', (res) => {
		menuHelpers.closeWorldEditForm();
		menuHelpers.paintNewWorld(res.world);
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
