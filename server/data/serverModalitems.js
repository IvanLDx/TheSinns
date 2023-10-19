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
	wall: {
		yellow: [],
		blue: [],
		green: [],
		red: []
	}
};

function getItems(url) {
	let folders = url.split('/');
	getFilesFromPath(url).forEach((item) => {
		ServerModalItems[folders[0]][folders[1]].push(
			new ServerModalItem({ url: url, name: item })
		);
	});
}

getItems('wall/yellow');
getItems('wall/blue');
getItems('wall/green');
getItems('wall/red');

module.exports = ServerModalItems;
