import { Camera } from './models/Camera.js';
import { MouseModel } from './models/Mouse.js';
import { Modal } from './models/components/Modal/Modal.js';
import { Tile } from './models/Tile.js';
import { GrabbedItem } from './models/Item/GrabbedItem.js';
import { helpers } from './helpers.js';
import { WorldItem } from './models/Item/WorldItem.js';
import { SelfPlayer } from './models/SelfPlayer.js';
import { Socket } from './models/Socket.js';

window.cv = document.querySelector('.canvas');
window.ctx = cv.getContext('2d');
window.cam = new Camera();
window.mouse = new MouseModel();

const modal = Modal.create();
let selfPlayer;
Socket.start();

cam.onResize(() => {
	modal.resize();
});

function act() {
	selfPlayer = SelfPlayer.element;
	if (selfPlayer) {
		cam.focus(selfPlayer);
		mouse.setPress();

		WorldItem.setPositionTile();
		Tile.setTouchedTile();
		paint();
	}
}

function paint() {
	helpers.paintSettings();
	Tile.paint();
	WorldItem.paint();
	modal.paint();
	GrabbedItem.paint();
}

document.onwheel = function (e) {
	cam.zoom(e);
};

document.querySelector('body').onresize = function () {
	cam.onResize(() => {
		modal.resize();
	});
};

document.onmousemove = function (e) {
	mouse.move(e);
};

document.onmousedown = function (e) {
	mouse.onLeftClick(e, (e) => {
		mouse.setPress(e);
		GrabbedItem.tryToCreate();
	});

	mouse.onRightClick(e, () => {
		document.onmousemove = function (e) {
			mouse.setDrag(e);
			selfPlayer.updatePosition();
		};
	});
};

document.onmouseup = function () {
	document.onmousemove = function (e) {
		mouse.move(e);
	};
	GrabbedItem.completeGrab();
	modal.clickOnArrowButton();
	mouse.stop();
};

document.oncontextmenu = function (e) {
	e.preventDefault();
};

setInterval(act, 1000 / 60);
