import { helpers } from '../helpers.js';
import { GrabbedItem } from './components/GrabbedItem.js';
let floorImg = helpers.getImage('floor');
let floorImg2 = helpers.getImage('floor2');

export class Tile {
	constructor(tile) {
		this.id = tile.id;
		this.col = tile.col;
		this.row = tile.row;
		this.w = tile.w;
		this.h = tile.h;
		this.img = tile.img;
		this.center = tile.center;
		this.touch = tile.touch;
	}

	intersects() {
		this.mousePosition = {
			x: Math.abs(mouse.x - this.center.x),
			y: Math.abs(mouse.y - this.center.y)
		};

		this.mouseTotalPos = this.calculateTotalXYPosition();
		this.touch = this.mouseIsInside();
		if (this.touch) {
			Tile.touchedTile = this;
		}
	}

	calculateTotalXYPosition() {
		return this.mousePosition.x + this.mousePosition.y * 2;
	}

	mouseIsInside() {
		return this.mouseTotalPos < this.center.x - this.col;
	}

	static setTouchedTile() {
		this.touchedTile = null;
		this.each((tile) => {
			tile.intersects();
		});
	}

	static createList(world) {
		Tile.list = [];
		world.forEach((tile) => {
			let newTile = new Tile(tile);
			Tile.list.push(newTile);
		});
	}

	static handleTouch(data) {
		let touchedTile = null;
		this.each((tile) => {
			tile.touch = false;
			if (data.touchedTile && tile.id === data.touchedTile.id) {
				tile.touch = true;
				touchedTile = tile;
			}
		});

		if (GrabbedItem.element) {
			GrabbedItem.element.touchedTile = touchedTile;
		}
	}

	static paint() {
		this.each((tile) => {
			ctx.drawImage(
				tile.touch ? floorImg2 : floorImg,
				0,
				0,
				tile.img.w + 2,
				tile.img.h + 1,
				tile.col * cam.pixelSize - cam.x,
				tile.row * cam.pixelSize - cam.y,
				tile.w * cam.pixelSize + cam.pixelSize * 2,
				tile.h * cam.pixelSize + cam.pixelSize
			);
		});
	}

	static each(evt) {
		this.list.forEach((tile) => {
			evt(tile);
		});
	}

	static touchedTile = null;
	static list = [];
}
