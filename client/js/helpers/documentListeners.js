import { ItemPopup } from '../models/Item/components/ItemPopup.js';
import { WorldItem } from '../models/Item/WorldItem.js';
import { GrabbedItem } from '../models/Item/GrabbedItem.js';
import { SelfPlayer } from '../models/SelfPlayer.js';
import { Modal } from '../models/components/Modal/Modal.js';

const modal = Modal.create();

export function init() {
	document.onwheel = documentListeners.onwheel;

	document.onmousemove = documentListeners.onmousemove;
	document.onmousedown = documentListeners.onmousedown;
	document.ontouchstart = documentListeners.onmousedown;

	document.onmouseup = documentListeners.onmouseup;
}

export function stop() {
	document.onwheel = null;

	document.onmousemove = null;
	document.onmousedown = null;
	document.ontouchstart = null;

	document.onmouseup = null;
}

const documentListeners = {
	onwheel: function (e) {
		cam.zoom(e);
	},
	onresize: function (interfaceElements) {
		cam.resizeInterface(interfaceElements);
	},
	onmousedrag: function (e) {
		mouse.setDrag(e);
		SelfPlayer.get().updatePosition();
	},
	onmousedown: function (e) {
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

				if (!GrabbedItem.element) {
					document.onmousemove = documentListeners.onmousedrag;
				}
			}
		});
	},
	onmousemove: function (e) {
		mouse.move(e);
	},
	onmouseup: function () {
		document.onmousemove = documentListeners.onmousemove;
		WorldItem.unselectItem();
		GrabbedItem.completeGrab();
		modal.clickOnButton();

		if (!mouse.dragging && WorldItem.touchedItems && WorldItem.touchedItems.length) {
			ItemPopup.create(WorldItem.touchedItems);
			ItemPopup.setPosition(WorldItem.getAboveItem());
		}

		mouse.stop();
		WorldItem.untouchItems();
	}
};
