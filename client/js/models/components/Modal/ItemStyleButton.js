import { OptionButton } from './OptionButton.js';
import { Modal } from './Modal.js';
import { imageHelpers } from '../../../helpers/imagehelpers.js';

export class ItemStyleButton extends OptionButton {
	constructor(key, category) {
		super();
		this.id = key;
		this.style = key;
		this.category = category;
		this.swatch = this.getImage();
	}

	intersectionEvents() {
		if (this.intersects()) {
			const modal = Modal.getElement();
			if (modal.category === this.category) {
				modal.setStyle(this.id);
				ItemStyleButton.setButtonStrokeColor(this.id);
				modal.update();
			}
		}
	}

	getImage() {
		return imageHelpers.getImage('/swatches/' + this.category + '/' + this.id);
	}

	repositioning(i) {
		super.repositioning();
		let totalWidth = this.w * (i + 1);
		this.x = cv.width - totalWidth - this.marginRight - this.gap * i;
	}

	paint() {
		super.paintContainer();
		imageHelpers.drawImage(this.swatch, imageHelpers.getSource(this.imageSize), {
			x: this.x + 3,
			y: this.y + 3,
			w: this.w - 6,
			h: this.h - 6
		});
	}

	static setButtonStrokeColor(id) {
		this.filter((button) => {
			return button.category === Modal.getElement().getCategory();
		}).forEach((button) => {
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
