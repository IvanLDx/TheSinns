const path = require('path');
function getPath(dir) {
	return path.resolve(path.dirname(require.main.filename) + '/' + dir);
}

module.exports = {
	getPath: getPath
};
