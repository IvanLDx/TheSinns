function getFilesFromPath(selectedPath) {
	const path = require('path');
	const fs = require('fs');
	const directoryPath = path.join(dirName, 'client/img/' + selectedPath);
	const files = fs.readdirSync(directoryPath);
	const fileNames = files.map((file) => file.replace('.png', ''));
	return fileNames;
}

const ServerModalItem = require('../models/ServerModalItem');

const ServerModalItems = {
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
		ServerModalItems[folders[0]][folders[1]].push(new ServerModalItem({ url: url, name: item }));
	});
}

getItems('roof/yellow');
getItems('roof/blue');
getItems('roof/green');
getItems('roof/red');

getItems('wall/yellow');
getItems('wall/blue');
getItems('wall/green');
getItems('wall/red');

getItems('wallElement/yellow');
getItems('wallElement/blue');
getItems('wallElement/green');
getItems('wallElement/red');

getItems('decoration/yellow');
getItems('decoration/blue');
getItems('decoration/green');
getItems('decoration/red');

getItems('floor/yellow');
getItems('floor/blue');
getItems('floor/green');
getItems('floor/red');

module.exports = ServerModalItems;
