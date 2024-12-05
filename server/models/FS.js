const fs = require('fs');

function tryCatch(callback) {
	const result = {};
	try {
		result.file = callback();
		result.success = true;
	} catch (e) {
		result.message = e;
		result.error = true;
	}

	return result.success ? result.file : result.error;
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

	static readWorld(worldID) {
		return tryCatch(() => JSON.parse(this.read('server/data/worlds/' + worldID + '.json')));
	}

	static readHtpasswd() {
		return this.read('../.htpasswds/.theSinnsHtpasswd');
	}
}

module.exports = FS;
