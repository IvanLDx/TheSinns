export const utils = {
	getModalPixelSize() {
		return 6;
	},
	paintSettings() {
		ctx.fillStyle = '#64e29d';
		ctx.fillRect(0, 0, cv.width, cv.height);
		ctx.imageSmoothingEnabled = false;
	},
	getCategory(url) {
		return url.split('/')[0];
	},
	getStyle(url) {
		return url.split('/')[1];
	},
	forEachObject(items, evt) {
		Object.entries(items).forEach((itemCategoryButton) => {
			evt(itemCategoryButton[1], itemCategoryButton[0]);
		});
	},
	testTime(evt) {
		let start = new Date().getTime();
		evt();
		let stop = new Date().getTime();
		let result = stop - start;
		return result;
	},
	getDestinationYByCategory(y, h, category) {
		let destinationY = y;
		if (y && h && category === 'roof') {
			destinationY = y - h / 1.7;
		}
		return destinationY;
	},
	convertFormDataToObject($form) {
		const formObject = {};
		const formData = new FormData($form);
		formData.forEach((value, key) => {
			if (formObject[key]) {
				if (Array.isArray(formObject[key])) {
					formObject[key].push(value);
				} else {
					formObject[key] = [formObject[key], value];
				}
			} else {
				formObject[key] = value;
			}
		});
		return formObject;
	}
};

export function ifis(element, callback) {
	if (element) {
		callback(element);
	}
}

let debouncingTimeout = null;
export function debounce(callback, delay = 200) {
	return function () {
		if (debouncingTimeout) {
			clearTimeout(debouncingTimeout);
		}
		debouncingTimeout = setTimeout(() => {
			callback();
			clearTimeout(debouncingTimeout);
		}, delay);
	};
}
