import { imageHelpers } from '../helpers/imagehelpers.js';
import { List } from './List.js';
import { GrabbedItem } from './Item/GrabbedItem.js';
let floorImg = imageHelpers.getImage('misc/floor');
let floorImg2 = imageHelpers.getImage('misc/floor2');

export class Tile extends List {
	constructor(tile) {
		super();
		this.id = tile.id;
		this.col = tile.col;
		this.row = tile.row;
		this.colID = tile.colID;
		this.rowID = tile.rowID;
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
		this.list = [];
		world.forEach((tile) => {
			let newTile = new Tile(tile);
			this.list.push(newTile);
		});

		return this.getList();
	}

	static paint() {
		this.each((tile) => {
			imageHelpers.drawImage(
				tile.image,
				{
					x: 0,
					y: 0,
					w: tile.img.w + 2,
					h: tile.img.h + 1
				},
				{
					x: tile.col * cam.pixelSize - cam.x,
					y: tile.row * cam.pixelSize - cam.y,
					w: tile.w * cam.pixelSize + cam.pixelSize * 2,
					h: tile.h * cam.pixelSize + cam.pixelSize
				}
			);
		});
	}

	static getTileInTheMiddle() {
		const tiles = this.getList();
		const lastTile = tiles[tiles.length - 1];
		const colInTheMiddle = ~~(lastTile.colID / 2);
		const rowInTheMiddle = ~~(lastTile.rowID / 2);

		const tileInTheMiddle = tiles.find((tile) => {
			return tile.colID === colInTheMiddle && tile.rowID === rowInTheMiddle;
		});

		return tileInTheMiddle;
	}

	static setOccupiedTile(occupiedTiles, tileToUpdate) {
		const occupiedTile = occupiedTiles.some((tileID) => {
			return tileID === tileToUpdate.id;
		});

		if (!occupiedTile) {
			occupiedTiles.push(tileToUpdate.id);
		}
	}

	static list = [];
}
