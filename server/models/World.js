const fs = require('fs');

class World {
	constructor(size) {
		let [w, h] = size.split('x');
		this.w = parseInt(w, 10);
		this.h = parseInt(h, 10);
		this.tile = {
			w: 20,
			h: 10
		};
	}

	setMap() {
		for (let row = 0; row < this.h; row += 1) {
			for (let col = 0; col < this.w; col += 1) {
				new Tile(col, row);
			}
		}
	}

	openMap() {
		let worldItemsRaw = fs.readFileSync(
			'server/data/savedWorld.json',
			'utf-8'
		);
		let worldItems = JSON.parse(worldItemsRaw);
		worldItems.forEach((item) => {
			World.placeItem(item);
		});
	}

	static getOccupiedTiles() {
		return this.tiles.filter((tile) => {
			return tile.occupied.some;
		});
	}

	static tiles = [];
	static items = {
		floor: [],
		decoration: [],
		wall: [],
		wallElement: []
	};

	static placeItem(item, tile) {
		World.items[item.type].push(item);

		tile = tile || World.tiles.findByID(item.touchedTile.id);
		tile.occupied[item.type] = true;
		tile.occupied.some = true;
	}
}

class Tile {
	constructor(col, row) {
		this.id = col + '-' + row;
		this.img = {
			file: 'floor',
			w: 20,
			h: 10
		};
		this.w = this.img.w;
		this.h = this.img.h;
		this.col = (row / 2) * this.w + (col * this.w) / 2;
		this.row = (row * this.h) / 2 - (col * this.h) / 2;

		this.center = {
			x: this.col + this.w / 2,
			y: this.row + this.h / 2
		};

		this.occupied = {
			some: false,
			wall: false,
			wallElement: false,
			decoration: false,
			floor: false
		};

		World.tiles.push(this);
	}

	isTypeOccupied(grabbedItem) {
		return this.occupied[grabbedItem.type];
	}

	isOccupied() {
		return (
			this.occupied.wall ||
			this.occupied.wallElement ||
			this.occupied.decoration ||
			this.occupied.floor
		);
	}
}

module.exports = World;
