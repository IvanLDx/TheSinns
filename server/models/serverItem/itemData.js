const fs = require('fs');

function getItemsJSONData(fileName) {
	const fileData = fs.readFileSync(`server/data/items/${fileName}.json`, 'utf8');
	let fileJSON = {};
	try {
		fileJSON = JSON.parse(fileData);
	} catch (e) {
		//
	}

	return fileJSON;
}

// const items = getItemsJSONData('items');
// const categories = getItemsJSONData('categories');
// let itemData;

function initialize() {
	let itemData = ItemData.getInstance();
	if (itemData) return itemData;

	const apiItems = getItemsJSONData('items');
	const apiCategories = getItemsJSONData('categories');
	const itemDataRaw = {};

	Object.entries(apiCategories).forEach(([categoryKey, subcategories]) => {
		if (!itemDataRaw[categoryKey]) {
			itemDataRaw[categoryKey] = {};
		}

		Object.entries(subcategories).forEach(([subcategoryKey, objects]) => {
			itemDataRaw[categoryKey][subcategoryKey] = objects.map((objectSku) => {
				const item = apiItems.find((item) => item.sku === objectSku);
				return new ServerModalItem({
					url: `${categoryKey}/${subcategoryKey}`,
					name: item ? item.name : '',
					sku: objectSku
				});
			});
		});
	});

	itemData = new ItemData(itemDataRaw, apiItems, apiCategories);

	return itemData;
}

/**
 * @ServerModalItem
 * Represents every item that will be shown withing
 * the world item modal (lower part of interface).
 * It's used by data from data/itemData.
 */
class ServerModalItem {
	constructor({ x, y, w, h, url, name, sku }) {
		this.x = x || 0;
		this.y = y || 0;
		this.w = w || 20;
		this.h = h || 28;
		this.url = url || 'client/img/worldItems/';
		this.name = name || 'default';
		this.sku = sku;
	}
	static list = [];
}

class ItemData {
	constructor(itemData, apiItems, apiCategories) {
		Object.assign(this, itemData);
		this.serverModalItems = itemData;
		this.itemWidth = 20;
		this.apiItems = apiItems;
		this.apiCategories = apiCategories;

		ItemData.instance = this;
	}

	getCategory(sku) {
		let itemm = Object.entries(this.apiCategories).find(([categoryKey, subcategories]) => {
			Object.entries(subcategories).find(([subcategoryKey, item]) => {
				return sku === item.sku;
			});
		});

		return itemm;
	}

	getApiItem(sku) {
		return this.apiItems.find((item) => item.sku === sku);
	}

	static getInstance() {
		return this.instance;
	}

	static instance = null;
}

module.exports = initialize();
