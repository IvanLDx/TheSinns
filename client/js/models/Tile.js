import { helpers } from '../helpers.js';
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

	static createList(world) {
		Tile.list = [];
		world.forEach((tile) => {
			let newTile = new Tile(tile);
			Tile.list.push(newTile);
		});
	}

	static handleTouch(data, grabbedItem) {
		let touchedTile = null;
		this.each((tile) => {
			tile.touch = false;
			if (data.touchedTile && tile.id === data.touchedTile.id) {
				tile.touch = true;
				touchedTile = tile;
			}
		});

		if (grabbedItem) {
			grabbedItem.touchedTile = touchedTile;
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

	static list = [];
}
