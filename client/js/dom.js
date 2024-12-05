export function $(elementSelector) {
	const self = typeof elementSelector === 'string' ? document.querySelector(elementSelector) : elementSelector;

	self.find = (subElementSelector) => {
		return self.querySelector(subElementSelector);
	};

	self.addClass = (className) => {
		self.classList.add(className);
		return self;
	};

	self.removeClass = (className) => {
		self.classList.remove(className);
		return self;
	};

	self.click = (closestElement, callback) => {
		self.addEventListener('click', (e) => {
			const $closest = e.target.closest(closestElement);
			if ($closest) {
				callback(e, $closest);
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
