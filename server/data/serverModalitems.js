const ServerModalItemItem = require('../models/ServerModalItem');

const ServerModalItems = {
	wall: {
		green1: new ServerModalItemItem({ name: 'wall-empty-yellow' }),
		green2: new ServerModalItemItem({ name: 'wall-worn-yellow' }),
		green3: new ServerModalItemItem({ name: 'wall-door-yellow' }),
		green4: new ServerModalItemItem({ name: 'wall-window-yellow' }),
		green5: new ServerModalItemItem({ name: 'deco-sakura-grey' })
	}
};

module.exports = ServerModalItems;
