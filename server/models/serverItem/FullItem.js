const itemData = req('models/serverItem/itemData');

class FullItem {
	constructor(item) {
		this.id = item.id;
		this.rotation = item.rotation;
		this.sku = item.sku;
		this.touchedTile = item.touchedTile.id || item.touchedTile;

		var apiItem = itemData.getApiItem(item.sku);
		this.name = apiItem.name;
		this.url = apiItem.primaryCategory;

		let category = apiItem.primaryCategory.split('/')[0];
		this.category = category;
	}

	static get(item) {
		return new FullItem(item);
	}
}

module.exports = FullItem;
