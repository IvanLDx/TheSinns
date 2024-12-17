const fs = require('fs');
let initialized = false;

function getFilesFromPath(selectedPath) {
	const path = require('path');
	const directoryPath = path.join(dirName, 'client/img/' + selectedPath);
	const files = fs.readdirSync(directoryPath);
	const fileNames = files.map((file) => file.replace('.png', ''));
	return fileNames;
}

const ServerModalItem = req('models/ServerModalItem');

const serverModalItems = {
	roof: {
		yellow: [],
		blue: [],
		green: [],
		red: []
	},
	wall: {
		yellow: [],
		blue: [],
		green: [],
		red: []
	},
	wallElement: {
		yellow: [],
		blue: [],
		green: [],
		red: []
	},
	decoration: {
		yellow: [],
		blue: [],
		green: [],
		red: []
	},
	floor: {
		yellow: [],
		blue: [],
		green: [],
		red: []
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
		Object.entries(serverModalItems).forEach(([section, type]) => {
			Object.entries(type).forEach(([key, val]) => {
				getItems(`${section}/${key}`);
			});
		});

		initialized = true;
	}

	return serverModalItems;
}

module.exports = initialize();
