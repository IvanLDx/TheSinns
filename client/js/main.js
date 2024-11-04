import { Camera } from './models/Camera.js';
import { SelfPlayer } from './models/SelfPlayer.js';
import { MouseModel } from './models/Mouse.js';
import { Socket } from './models/Socket.js';
import { utils } from './utils.js';

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

document.onwheel = function (e) {
	cam.zoom(e);
};

document.querySelector('body').onresize = function () {
	cam.resizeInterface(interfaceElements);
};

document.onmousemove = function (e) {
	mouse.move(e);
};

document.onmousedown = function (e) {
	mouse.onLeftClick(e, (e) => {
		ItemPopup.close();
		mouse.setPress(e);

		const touchedItemPopupButton = ItemPopup.getTouchedButton();
		if (touchedItemPopupButton) {
			const selectedItem = WorldItem.getItemByID(touchedItemPopupButton.id);
			if (selectedItem) {
				mouse.setItemTile(selectedItem);
				WorldItem.selectItem(selectedItem);
				GrabbedItem.grab(selectedItem);
				WorldItem.removeItem();
			}
		} else {
			mouse.setTouchedTile();

			let selectedItem = WorldItem.tryToSelect();
			if (selectedItem) {
				GrabbedItem.grab(selectedItem);
			} else {
				GrabbedItem.tryToCreate();
			}
		}
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
	WorldItem.unselectItem();
	GrabbedItem.completeGrab();
	modal.clickOnButton();

	if (!mouse.dragging && WorldItem.touchedItems && WorldItem.touchedItems.length) {
		ItemPopup.create(WorldItem.touchedItems);
		ItemPopup.setPosition(WorldItem.getAboveItem());
	}

	mouse.stop();
	WorldItem.untouchItems();
};

document.oncontextmenu = function (e) {
	e.preventDefault();
};

setInterval(act, 1000 / 60);
