const fs = require('fs');
let initialized = false;

function getFilesFromPath(selectedPath) {
	const path = require('path');
	const directoryPath = path.join(dirName, 'client/img/worldItems/' + selectedPath);
	const files = fs.readdirSync(directoryPath);
	const fileNames = files.map((file) => file.replace('.png', ''));
	return fileNames;
}

const ServerModalItem = req('models/ServerModalItem');

const serverModalItems = {
	roof: {
		ceramic: []
	},
	wall: {
		flat: [],
		brick: [],
		old: []
	},
	wallElement: {
		door: [],
		window: []
	},
	decoration: {
		plant: []
	},
	floor: {
		stone: []
	},
	itemwidth: 20
};

function getItems(url) {
	let folders = url.split('/');
	getFilesFromPath(url).forEach((item) => {
		serverModalItems[folders[0]][folders[1]].push(new ServerModalItem({ url: url, name: item }));
	});
}

function initialize() {
	if (!initialized) {
		Object.entries(serverModalItems).forEach(([section, category]) => {
			Object.entries(category).forEach(([key, val]) => {
				getItems(`${section}/${key}`);
			});
		});

		initialized = true;
	}

	return serverModalItems;
}

module.exports = initialize();
