const fs = require('fs');

/**
 * @World_Class
 * This class represents the game world. It initializes
 * the size of the world based on input parameters, sets up the map grid
 * and provides methods for opening a saved map and placing items within
 * the world.
 *
 * Static Properties and Methods
 * The World class contains static properties to keep track of
 * all tiles (tiles) and items (items) within the world. It also has
 * static methods for placing items on tiles andretrieving occupied tiles.
 *
 * @Tile_Class
 * This class represents individual tiles within the game world grid.
 * Each tile has an ID, position, dimensions, image information
 * and occupancy status.
 */

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
		return World.tiles.filter((tile) => {
			return tile.occupied.some;
		});
	}

	static placeItem(item, tile) {
		World.items[item.type].push(item);

		tile = tile || World.findByID(item.touchedTile.id);
		tile.occupied[item.type] = true;
		tile.occupied.some = true;
	}

	static findByID(id, callback = null) {
		let found = World.tiles.find((el) => {
			return el.id === id;
		});
		if (found && callback) {
			callback(found);
		}
		return found;
	}

	static getPack() {
		return {
			occupiedTiles: World.getOccupiedTiles(),
			worldItems: World.items
		};
	}

	static tiles = [];
	static items = {
		floor: [],
		decoration: [],
		wall: [],
		wallElement: []
	};
}

class Tile {
	constructor(col, row) {
		this.id = col + '-' + row;
		this.img = {
			file: 'floor',
			w: 20,
			h: 10
		};
		this.colID = col;
		this.rowID = row;
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
