const fs = require('fs');

function tryCatch(callback) {
	const result = {};
	try {
		result.file = callback();
		result.success = true;
	} catch (e) {
		result.message = e.message;
		result.error = true;
	}

	return result.success ? result.file : result;
}

class FS {
	constructor() {}

	static read(path) {
		return tryCatch(() => fs.readFileSync(path, 'utf-8'));
	}

	static readOld() {
		return this.read('server/data/savedWorld.json');
	}

	static readAccount(accountName) {
		return tryCatch(() => JSON.parse(this.read('server/data/accounts/' + accountName + '.json')));
	}

	static writeAccount(accountName, playerDataObj) {
		return tryCatch(() => {
			const result = {};
			if (typeof playerDataObj === 'object') {
				let playerData = JSON.stringify(playerDataObj, null, 4);
				fs.writeFileSync('server/data/accounts/' + accountName + '.json', playerData);
				result.success = true;
			} else {
				result.error = true;
				result.message = 'playerData is not an Object';
			}
			return result;
		});
	}

	static readWorld(worldID) {
		return tryCatch(() => JSON.parse(this.read('server/data/worlds/' + worldID + '.json')));
	}

	static writeWorld(worldID, worldItemsObj) {
		return tryCatch(() => {
			const result = {};
			if (typeof worldItemsObj === 'object') {
				let worldItems = JSON.stringify(worldItemsObj, null, 4);
				fs.writeFileSync('server/data/worlds/' + worldID + '.json', worldItems);
				result.success = true;
			} else {
				result.error = true;
				result.message = 'worldItemsObj is not an Object';
			}
			return result;
		});
	}

	static readHtpasswd() {
		return this.read('../.htpasswds/.theSinnsHtpasswd');
	}
}

module.exports = FS;
