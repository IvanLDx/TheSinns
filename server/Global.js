module.exports = function () {
	Array.prototype.findByID = function findByID(id, callback = null) {
		let found = this.find((el) => {
			return el.id === id;
		});
		if (found && callback) {
			callback(found);
		}
		return found;
	};
};
