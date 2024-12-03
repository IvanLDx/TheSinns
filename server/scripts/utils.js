const path = require('path');
function getPath(dir) {
	return path.resolve(path.dirname(require.main.filename) + '/' + dir);
}

function getMinutes(minutes) {
	return 1000 * 60 * minutes;
}

module.exports = {
	getPath: getPath,
	getMinutes: getMinutes
};
