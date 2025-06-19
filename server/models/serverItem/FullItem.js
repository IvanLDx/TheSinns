const itemData = req('models/serverItem/itemData');

class FullItem {
	constructor(item) {
		var apiItem = itemData.getApiItem(item.sku);
		let category = apiItem.primaryCategory.split('/')[0];

		Object.assign(this, item);
		this.name = apiItem.name;
		this.category = category;
		this.url = apiItem.primaryCategory;
	}

	static get(item) {
		return new FullItem(item);
	}
}

module.exports = FullItem;
