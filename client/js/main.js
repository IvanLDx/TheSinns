import { Camera } from './models/Camera.js';
import { SelfPlayer } from './models/SelfPlayer.js';
import { MouseModel } from './models/Mouse.js';
import { Socket } from './models/Socket.js';
import { utils, debounce } from './utils.js';

import { Modal } from './models/components/Modal/Modal.js';
import { Tile } from './models/Tile.js';
import { GrabbedItem } from './models/Item/GrabbedItem.js';
import { WorldItem } from './models/Item/WorldItem.js';

import { Button } from './models/components/Button.js';
import { BurgerButton } from './models/components/BurgerMenu/BurgerButton.js';
import { ItemPopup } from './models/Item/components/ItemPopup.js';

window.cv = document.querySelector('.canvas');
window.ctx = cv.getContext('2d');
window.cam = new Camera();
window.mouse = new MouseModel();

const socket = Socket.getLibrary();
let modal;
let burgerButton;
let selfPlayer;
let gameInterval = null;
Socket.start();

function act() {
	selfPlayer = SelfPlayer.element;
	if (selfPlayer) {
		cam.focus(selfPlayer);

		modal.update();
		WorldItem.setPositionTile();
		Tile.setTouchedTile();
		paint();
		ItemPopup.update();
	}
}

function paint() {
	utils.paintSettings();
	Tile.paint();
	WorldItem.paint();
	modal.paint();
	GrabbedItem.paint();
	burgerButton.paint();
	ItemPopup.paint();

	mouse.paintToolkit();
	if (mouse.toolkit) {
		mouse.toolkit.drawContent();
	}
}

function init() {
	modal = Modal.create();
	burgerButton = BurgerButton.create();

	const interfaceElements = [modal, burgerButton];
	cam.resizeInterface(interfaceElements);

	gameInterval = setInterval(act, 1000 / 60);

	document.querySelector('body').onresize = debounce(() => {
		cam.resizeInterface(interfaceElements);
	});
}

function stopEvents() {
	modal = Modal.delete();
	burgerButton = BurgerButton.delete();
	Button.deleteList();

	document.querySelector('body').onresize = null;
}

document.oncontextmenu = function (e) {
	e.preventDefault();
};

socket.on('selectWorld-OK', (data) => {
	init();
});

socket.on('exitWorld-OK', () => {
	stopEvents();
	clearInterval(gameInterval);
});
