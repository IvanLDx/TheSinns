import { utils } from '../../../utils.js';
import { Button } from '../Button.js';
import { Modal } from './Modal.js';

export class RotationArrows extends Button {
	constructor() {
		super();
		this.w = 60;
		this.leftArrow = new leftArrow();
		this.rightArrow = new RightArrow();
	}

	repositioning() {
		super.repositioning();
		this.x = cv.width / 2 - this.w / 2;
	}

	paint() {
		super.paintContainer();
		this.leftArrow.paint(this);
		this.rightArrow.paint(this);
	}
}

class ArrowButton extends Button {
	constructor(image) {
		super(image);
		this.w = 20;
		this.h = 20;
	}

	intersectionEvents(evt) {
		if (this.intersects()) {
			let activeItems = Modal.getActiveItems();
			activeItems.forEach((item) => {
				evt(item);
			});
		}
	}

	paint() {
		this.paintImage();
	}
}

class leftArrow extends ArrowButton {
	constructor() {
		super('interface/leftArrow');
		this.id = 'leftArrow';

		Button.push(this);
	}

	intersectionEvents() {
		super.intersectionEvents((item) => {
			item.rotateLeft();
		});
	}

	paint(RotationModal) {
		this.x = RotationModal.x + 5;
		this.y = RotationModal.y + 5;
		super.paint();
	}
}

class RightArrow extends ArrowButton {
	constructor() {
		super('interface/rightArrow');
		this.id = 'rightArrow';

		Button.push(this);
	}

	intersectionEvents() {
		super.intersectionEvents((item) => {
			item.rotateRight();
		});
	}

	paint(RotationModal) {
		this.x = RotationModal.x + RotationModal.w - this.w - 5;
		this.y = RotationModal.y + 5;
		super.paint();
	}
}
