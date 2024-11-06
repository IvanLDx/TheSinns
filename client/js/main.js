import { Camera } from './models/Camera.js';
import { SelfPlayer } from './models/SelfPlayer.js';
import { MouseModel } from './models/Mouse.js';
import { Socket } from './models/Socket.js';
import { utils } from './utils.js';
import { documentListeners } from './helpers/documentListeners.js';

import { Modal } from './models/components/Modal/Modal.js';
import { Tile } from './models/Tile.js';
import { GrabbedItem } from './models/Item/GrabbedItem.js';
import { WorldItem } from './models/Item/WorldItem.js';

import { BurgerButton } from './models/components/BurgerMenu/BurgerButton.js';
import { ItemPopup } from './models/Item/components/ItemPopup.js';

window.cv = document.querySelector('.canvas');
window.ctx = cv.getContext('2d');
window.cam = new Camera();
window.mouse = new MouseModel();
window._ = console.log.bind(window.console);

const modal = Modal.create();
const burgerButton = BurgerButton.create();
let selfPlayer;
Socket.start();

const interfaceElements = [modal, burgerButton];

cam.resizeInterface(interfaceElements);

function act() {
	selfPlayer = SelfPlayer.element;
	if (selfPlayer) {
		cam.focus(selfPlayer);

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

document.querySelector('body').onresize = function () {
	cam.resizeInterface(interfaceElements);
};

document.onwheel = documentListeners.onwheel;

document.onmousemove = documentListeners.onmousemove;
document.onmousedown = documentListeners.onmousedown;
document.ontouchstart = documentListeners.onmousedown;

document.onmouseup = documentListeners.onmouseup;

document.oncontextmenu = function (e) {
	e.preventDefault();
};

setInterval(act, 1000 / 60);
