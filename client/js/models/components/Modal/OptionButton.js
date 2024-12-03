import { Button } from '../Button.js';

export class OptionButton extends Button {
	constructor() {
		super();
		this.w = 30;
		this.marginRight = 20;
		this.gap = 16;
		this.imageSize = 10;
		this.selected = false;

		Button.push(this);
	}

	static setButtonStrokeColor(type, id) {
		this.each((button) => {
			if (button.id === id) {
				button.selected = true;
				button.setSelectedStroke();
			} else if (button.buttonType === type) {
				button.setStandardStroke();
				button.selected = false;
			}
		});
	}
}
