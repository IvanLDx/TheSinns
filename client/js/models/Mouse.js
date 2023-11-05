import { GrabbedItem } from './Item/GrabbedItem.js';
import { WorldItem } from './Item/WorldItem.js';
import { Button } from './components/Button.js';
import { Tile } from './Tile.js';

export class MouseModel {
	constructor() {
		this.x = 0;
		this.y = 0;
		this.press = { x: 0, y: 0 };
		this.drag = { x: 0, y: 0 };
		this.pressing = false;
		this.absoluteX = 0;
		this.absoluteY = 0;
		this.isThereIntersection = false;
		this.selectedColor = null;
	}

	style(value) {
		document.body.style.cursor = value;
	}

	move(e) {
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
	}

	setPosition(e) {
		this.x = ~~((e.clientX + cam.x) / cam.pixelSize);
		this.y = ~~((e.clientY + cam.y) / cam.pixelSize);

		this.absoluteX = e.clientX;
		this.absoluteY = e.clientY;
	}

	setPress(e) {
		if (mouse.pressing) {
			this.press = {
				x: e?.clientX || this.x,
				y: e?.clientY || this.y
			};
		}
	}

	intersections() {
		this.isThereIntersection = false;
		Button.each((button) => {
			if (mouse.absoluteIntersects(button)) {
				mouse.style('pointer');
				this.selectedColor = button.id;
				this.isThereIntersection = true;
			}
		});
		if (!this.isThereIntersection) {
			mouse.style('initial');
			this.selectedColor = null;
		}
	}

	absoluteIntersects(element) {
		return (
			this.absoluteX > element.x &&
			this.absoluteX < element.x + element.w &&
			this.absoluteY > element.y &&
			this.absoluteY < element.y + element.h
		);
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
	}

	stop() {
		this.drag = { x: 0, y: 0 };
		if (!this.isThereIntersection) {
			this.style('initial');
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
