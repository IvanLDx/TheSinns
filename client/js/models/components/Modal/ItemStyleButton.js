import { OptionButton } from './OptionButton.js';
import { Modal } from './Modal.js';

export class ItemStyleButton extends OptionButton {
	constructor(key, category) {
		super();
		this.id = key;
		this.swatch = '#e6c26c';
		this.style = key;
		this.category = category;
		this.buttonType = 'itemStyle';
	}

	intersectionEvents() {
		if (this.intersects()) {
			const modal = Modal.getElement();
			if (modal.folder === this.category) {
				modal.subfolder = this.id;
				ItemStyleButton.setButtonStrokeColor(this.id);
				modal.updatePositionItems();
			}
		}
	}

	repositioning(i) {
		super.repositioning();
		let totalColorWidth = this.w * (i + 1);
		this.x = cv.width - totalColorWidth - this.marginRight - this.gap * i;
	}

	paint() {
		super.paintContainer();
		ctx.fillStyle = this.swatch;
		ctx.fillRect(this.x + 5, this.y + 5, this.w - 10, this.h - 10);
	}

	static setButtonStrokeColor(id) {
		this.filter((button) => {
			return button.category === Modal.getElement().folder;
		}).forEach((button) => {
			console.log(button, id);
			if (button.id === id) {
				button.selected = true;
				button.setSelectedStroke();
			} else {
				button.setStandardStroke();
				button.selected = false;
			}
		});
	}
}
