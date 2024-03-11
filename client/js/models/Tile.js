import { utils } from '../utils.js';
import { List } from './List.js';
import { GrabbedItem } from './Item/GrabbedItem.js';
let floorImg = utils.getImage('misc/floor');
let floorImg2 = utils.getImage('misc/floor2');

export class Tile extends List {
	constructor(tile) {
		super();
		this.id = tile.id;
		this.col = tile.col;
		this.row = tile.row;
		this.w = tile.w;
		this.h = tile.h;
		this.img = tile.img;
		this.image = floorImg;
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
		this.image = this.touch ? floorImg2 : floorImg;
		return this.touch;
	}

	calculateTotalXYPosition() {
		return this.mousePosition.x + this.mousePosition.y * 2;
	}

	mouseIsInside() {
		return this.mouseTotalPos < this.center.x - this.col;
	}

	static setTouchedTile() {
		let isThereIntersection = false;
		this.each((tile) => {
			if (tile.intersects()) {
				isThereIntersection = true;
				GrabbedItem.setTouchedTile(tile);
			}
		});
		if (!isThereIntersection) {
			GrabbedItem.unsetTouchedTile();
		}
	}

	static createList(world) {
		Tile.list = [];
		world.forEach((tile) => {
			let newTile = new Tile(tile);
			Tile.list.push(newTile);
		});
	}

	static paint() {
		this.each((tile) => {
			ctx.drawImage(
				tile.image,
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
}
