import { Socket } from '../models/Socket.js';
import * as menuHelpers from './menuHelpers.js';
let initialized = false;

function initializeSocket() {
	const socket = Socket.get();

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
