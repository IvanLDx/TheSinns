export const utils = {
	getModalPixelSize() {
		return 6;
	},
	paintSettings() {
		ctx.fillStyle = '#64e29d';
		ctx.fillRect(0, 0, cv.width, cv.height);
		ctx.imageSmoothingEnabled = false;
	},
	getFolder(url) {
		return url.split('/')[0];
	},
	forEachType(items, evt) {
		Object.entries(items).forEach((itemTypes) => {
			itemTypes[1].forEach((item) => {
				evt(item);
			});
		});
	},
	forEachObject(items, evt) {
		Object.entries(items).forEach((itemTypes) => {
			evt(itemTypes[1], itemTypes[0]);
		});
	},
	testTime(evt) {
		let start = new Date().getTime();
		evt();
		let stop = new Date().getTime();
		let result = stop - start;
		_(result);
		return result;
	},
	getDestinationYByType(y, h, type) {
		let destinationY = y;
		if (y && h && type === 'roof') {
			destinationY = y - h / 1.7;
		}
		return destinationY;
	}
};

export function ifis(element, callback) {
	if (element) {
		callback(element);
	}
}
