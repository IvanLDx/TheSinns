export function $(elementSelector) {
	const self = typeof elementSelector === 'string' ? document.querySelector(elementSelector) : elementSelector;

	self.find = (subElementSelector) => {
		return $(self.querySelector(subElementSelector));
	};

	self.addClass = (className) => {
		self.classList.add(className);
		return self;
	};

	self.hasClass = (className) => {
		return self.classList.contains(className);
	};

	self.removeClass = (className) => {
		self.classList.remove(className);
		return self;
	};

	self.click = (closestElement, callback) => {
		self.addEventListener('click', (e) => {
			const closest = e.target.closest(closestElement);
			if (closest) {
				callback(e, $(closest));
			}
		});
	};

	self.attr = (obj) => {
		Object.entries(obj).forEach(([key, val]) => {
			self.setAttribute(key, val);
		});
	};
	return self;
}

/**
 * AJAX for PHP helpers
 * @param {object} obj ajax object
 * @param {function} loading data while requesting
 * @param {function} success data after request
 * @param {string} method send method
 * @param {string} url PHP file helper's name
 * @param {string} data client side request
 */
$.ajax = function (obj) {
	obj.loading && obj.loading(obj);
	var ajax = new XMLHttpRequest();
	ajax.onreadystatechange = function (e) {
		this.readyState == 4 && (obj.success && obj.success(JSON.parse(e.target.response)), obj.raw && obj.raw(e.target));
	};

	var completeURL = `${obj.url}`;

	if (obj.method === 'POST') {
		ajax.open(obj.method, completeURL, true);
		ajax.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
		ajax.send(obj.data);
	} else {
		completeURL += obj.data;
		ajax.open(obj.method, completeURL, true);
		ajax.send();
	}
};

window.$ = $;
