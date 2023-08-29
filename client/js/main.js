import { Camera } from './models/Camera.js';
import { MouseModel } from './models/Mouse.js';
import { Modal } from './models/components/Modal.js';
import { Tile } from './models/Tile.js';
import { Item } from './models/components/Item.js';
import { helpers } from './helpers.js';
import { WorldItem } from './models/WorldItem.js';
import { Entity } from './models/Entity.js';
import { Socket } from './models/Socket.js';

window.cv = document.querySelector('.canvas');
window.ctx = cv.getContext('2d');
window.cam = new Camera();
window.mouse = new MouseModel();

const socket = io();
Entity.itemsModal = new Modal();
Socket.start();

cam.onResize(() => {
	Entity.itemsModal.resize();
});

function act() {
	if (Entity.selfPlayer) {
		cam.focus(Entity.selfPlayer);
		mouse.setPress();
		Socket.sendToServer();
		paint();
	}
}

function paint() {
	helpers.paintSettings();
	Tile.paint();
	WorldItem.paint();
	Entity.itemsModal.paint();
	Item.paintGrabbedItem();
}

document.onwheel = function (e) {
	cam.zoom(e);
};

document.querySelector('body').onresize = function () {
	cam.onResize(() => {
		Entity.itemsModal.resize();
	});
};

document.onmousemove = function (e) {
	mouse.move(e, Item.grabbed);
};

document.onmousedown = function (e) {
	mouse.onLeftClick(e, (e) => {
		mouse.setPress(e);
		Item.handleIntersections();
	});

	mouse.onRightClick(e, () => {
		document.body.style.cursor = 'grab';
		document.onmousemove = function (e) {
			mouse.setDrag(e);
			document.body.style.cursor = 'grabbing';
		};
	});
};

document.onmouseup = function () {
	document.body.style.cursor = 'initial';
	document.onmousemove = function (e) {
		mouse.move(e, Item.grabbed);
	};
	Item.completeGrab(socket);
	mouse.stop();
};

document.oncontextmenu = function (e) {
	e.preventDefault();
};

setInterval(act, 1000 / 60);
