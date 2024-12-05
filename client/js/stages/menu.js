import { stage } from '../models/Stage.js';
import { Socket } from '../models/Socket.js';
import { Modal } from '../models/components/Modal/Modal.js';
import { BurgerButton } from '../models/components/BurgerMenu/BurgerButton.js';
import * as documentListeners from '../helpers/documentListeners.js';
import * as menuHelpers from './menuHelpers.js';
let initialized = false;

function initializeSocket() {
	const socket = Socket.get();

	socket.on('enterWorld', (data) => {});

	socket.on('selectWorld-OK', (data) => {
		stage.change('world');
		const interfaceElements = [Modal.create(), BurgerButton.create()];
		cam.resizeInterface(interfaceElements);

		documentListeners.init();
	});

	menuHelpers.onClickWorldSheet((e, $worldSheet) => {
		const world = {
			id: $worldSheet.getAttribute('data-id'),
			size: $worldSheet.getAttribute('data-size')
		};
		socket.emit('selectWorld', { world: world });
	});

	initialized = true;
}

if (!initialized) {
	initializeSocket();
}
