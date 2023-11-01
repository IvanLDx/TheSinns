import { Button } from './Button.js';

export class OptionButton extends Button {
	constructor() {
		super();
		this.w = 30;
		this.marginRight = 20;
		this.gap = 16;

		Button.push(this);
	}

	static setButtonStrokeColor(type, id) {
		this.each((button) => {
			if (button.id === id) {
				button.setSelectedStroke();
			} else if (button.buttonType === type) {
				button.setStandardStroke();
			}
		});
	}
}
