const Item = require('../models/Item');

const items = {
	wall: {
		green1: new Item({
			x: 0,
			y: 0,
			w: 20,
			h: 28,
			name: 'wall'
		}),
		green2: new Item({
			x: 0,
			y: 0,
			w: 20,
			h: 28,
			name: 'deco-sakura-grey'
		}),
		green3: new Item({
			x: 40,
			y: 0,
			w: 20,
			h: 28,
			name: 'wall-worn-yellow'
		}),
		green4: new Item({
			x: 60,
			y: 0,
			w: 20,
			h: 28,
			name: 'wall'
		})
	}
};

module.exports = items;
