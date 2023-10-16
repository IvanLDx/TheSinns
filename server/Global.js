module.exports = function () {
	Array.prototype.findByID = function findByID(id, evt = null) {
		let found = this.find((el) => {
			return el.id === id;
		});
		if (found && evt) {
			evt(found);
		}
		return found;
	};
};
