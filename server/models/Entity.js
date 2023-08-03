class Entity {
	constructor() {
		var self = {
			x: 40,
			y: 40,
			w: 10,
			h: 10,
			spdX: 0,
			spdY: 0
		};
		self.update = function () {
			self.updatePosition();
		};
		self.updatePosition = function () {
			self.x += self.spdX;
			self.y += self.spdY;
		};
		return self;
	}
}

module.exports = Entity;
