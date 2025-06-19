import { GrabbedItem } from './Item/GrabbedItem.js';
import { Toolkit } from './components/Toolkit.js';
import { WorldItem } from './Item/WorldItem.js';
import { Button } from './components/Button.js';
import { Tile } from './Tile.js';
import { ItemPopup } from './Item/components/ItemPopup.js';

export class MouseModel {
	constructor() {
		this.x = 0;
		this.y = 0;
		this.press = { x: 0, y: 0 };
		this.drag = { x: 0, y: 0 };
		this.pressing = false;
		this.dragging = false;
		this.absoluteX = 0;
		this.absoluteY = 0;
		this.isThereIntersection = false;
		this.selectedColor = null;
	}

	style(value) {
		document.body.style.cursor = value;
	}

	move(e) {
		if (Toolkit.activeOnStart) {
			this.toggleToolkit();
			Toolkit.activeOnStart = false;
		}
		let grabbedItem = GrabbedItem.element;
		this.setPosition(e);
		if (grabbedItem) {
			this.style('none');
			grabbedItem.move();
			let selectedWorldItem = WorldItem.selected;
			if (selectedWorldItem) {
				if (this.touchedTile.id === selectedWorldItem.id) {
					this.setTouchedTile();
				} else {
					WorldItem.removeItem();
				}
			}
		}

		this.intersections();

		if (this.pressing) {
			this.dragging = true;
		}

		const touchedTile = Tile.find((item) => item.touch);
		WorldItem.list.forEach((worldItem) => {
			worldItem.touchedByMouse = touchedTile && touchedTile.id === worldItem.touchedTile.id;
		});
	}

	setPosition(e) {
		this.x = ~~((e.clientX + cam.x) / cam.pixelSize);
		this.y = ~~((e.clientY + cam.y) / cam.pixelSize);

		this.absoluteX = e.clientX;
		this.absoluteY = e.clientY;

		if (this.toolkit) {
			this.toolkit.handleEvents(this);
		}
	}

	setPress(e) {
		this.pressing = !!e;
		this.press = {
			x: e?.clientX || this.x,
			y: e?.clientY || this.y
		};
	}

	unsetPress() {
		this.pressing = false;
	}

	intersections() {
		this.isThereIntersection = false;
		Button.each((button) => {
			if (this.absoluteIntersects(button)) {
				this.style('pointer');
				this.selectedColor = button.id;
				this.isThereIntersection = true;
			}
		});
		if (!this.isThereIntersection) {
			if (!keyboard.pressing.Space) {
				this.style('initial');
			}
			this.selectedColor = null;
		}
	}

	absoluteIntersects(element) {
		return this.absoluteX > element.x && this.absoluteX < element.x + element.w && this.absoluteY > element.y && this.absoluteY < element.y + element.h;
	}

	absoluteIntersectsInModal(element) {
		let isThereIntersection = false;
		if (element.position) {
			isThereIntersection =
				this.absoluteX > element.position.x &&
				this.absoluteX < element.position.x + element.position.w &&
				this.absoluteY > element.position.y &&
				this.absoluteY < element.position.y + element.position.h;
		}
		return isThereIntersection;
	}

	setTouchedTile() {
		let touched = false;
		Tile.each((tile) => {
			if (tile.intersects()) {
				touched = true;
				this.touchedTile = tile;
			}
		});
		if (!touched) {
			this.touchedTile = null;
		}
	}

	setItemTile(item) {
		this.touchedTile = item.touchedTile;
	}

	setDrag(e) {
		this.press = {
			x: this.x,
			y: this.y
		};

		this.x = e.clientX;
		this.y = e.clientY;

		let x = ~~((this.press.x - this.x) / cam.pixelSize);
		let y = ~~((this.press.y - this.y) / cam.pixelSize);

		if (Math.abs(x) < 10 && Math.abs(y) < 20) {
			this.drag = { x: x, y: y };
		}
		this.style('grabbing');

		ItemPopup.close();
	}

	stop() {
		this.drag = { x: 0, y: 0 };
		if (!this.isThereIntersection) {
			if (keyboard.pressing.Space) {
				this.style('grab');
			} else {
				this.style('initial');
			}
		}
		this.pressing = false;
		this.dragging = false;
	}

	paintToolkit() {
		if (this.toolkit) {
			this.toolkit.paint();
		}
	}

	toggleToolkit() {
		if (this.toolkit) {
			this.toolkit = null;
		} else {
			this.toolkit = new Toolkit(this);
		}
	}

	onLeftClick(e, evt) {
		if (e.button === 0 && evt) {
			evt(e);
		}
	}

	onRightClick(e, evt) {
		if (e.button === 2 && evt) {
			this.style('grab');
			evt(e);
		}
	}
}
