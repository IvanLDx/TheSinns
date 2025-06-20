export class ItemMgr {
	constructor(itemData) {
		this.itemWidth = itemData.itemWidth;
		this.apiCategories = itemData.apiCategories;
		this.apiItems = itemData.apiItems;
		this.modalItems = itemData.modalItems;
	}

	static checkAndGet(param) {
		if (!this.instance) {
			return;
		}

		return this.instance[param];
	}

	static getItemWidth() {
		return this.checkAndGet('itemWidth');
	}

	static getCategories() {
		return this.checkAndGet('apiCategories');
	}

	static getItems() {
		return this.checkAndGet('apiItems');
	}

	static getModalItems() {
		return this.checkAndGet('modalItems');
	}

	static set(itemData) {
		this.instance = new ItemMgr(itemData);
	}

	static instance = null;
}
