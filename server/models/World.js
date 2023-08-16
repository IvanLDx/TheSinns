class World {
	constructor(size) {
		let [w, h] = size.split('x');
		this.w = parseInt(w, 10);
		this.h = parseInt(h, 10);
		this.tile = {
			w: 20,
			h: 10
		};

		World.active = this;
	}

	setMap() {
		for (let row = 0; row < this.h; row += 1) {
			for (let col = 0; col < this.w; col += 1) {
				new Tile(col, row);
			}
		}
	}

	static setTouchedTile(pack) {
		this.touchedTile = false;
		this.tiles.forEach((tile) => {
			tile.intersects(pack);
		});
	}

	static getTouchedTile() {
		return World.touchedTile;
	}

	static active;
	static tiles = [];
	static toucedTile = false;
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

		World.tiles.push(this);
	}

	intersects(pack) {
		this.mousePosition = {
			x: Math.abs(pack.mouse.x - this.center.x),
			y: Math.abs(pack.mouse.y - this.center.y)
		};

		this.mouseTotalPos = this.calculateTotalXYPosition();
		this.touch = this.mouseIsInside();
		if (this.touch) {
			World.touchedTile = this;
		}
	}

	calculateTotalXYPosition() {
		return this.mousePosition.x + this.mousePosition.y * 2;
	}

	mouseIsInside() {
		return this.mouseTotalPos < this.center.x - this.col;
	}
}

module.exports = World;
