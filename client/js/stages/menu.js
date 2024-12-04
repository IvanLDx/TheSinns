import { Socket } from '../models/Socket.js';
const socket = Socket.get();

socket.on('enterWorld', (data) => {
	if (data.success) {
		stage.change('world');

		const interfaceElements = [Modal.create(), BurgerButton.create()];
		cam.resizeInterface(interfaceElements);

		documentListeners.init();
	}
});
