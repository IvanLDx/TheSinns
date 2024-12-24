import { Button } from '../Button.js';
import { Modal } from './Modal.js';

export class RotationArrows extends Button {
	constructor(modal) {
		super();
		this.modal = modal;
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

export class PaginationArrows extends Button {
	constructor(modal) {
		super();
		this.modal = modal;
		this.h = 60;
		this.upArrow = new UpArrow();
		this.downArrow = new DownArrow();
		this.totalPages = 1;
		this.page = 1;
	}

	repositioning() {
		this.x = this.modal.right - this.w;
		this.y = this.modal.y + this.modal.h / 2 - this.w;
	}

	paint() {
		super.paintContainer();
		this.upArrow.paint(this);
		this.downArrow.paint(this);
	}
}

class ArrowButton extends Button {
	constructor(image) {
		super(image);
		this.w = 20;
		this.h = 20;
		this.imageSize = this.w;
	}

	intersectionEvents(evt) {
		if (this.intersects()) {
			Modal.loopActiveItems((item) => {
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

class UpArrow extends ArrowButton {
	constructor() {
		super('interface/upArrow');
		this.id = 'upArrow';

		Button.push(this);
	}

	intersectionEvents() {
		if (this.intersects()) {
			Modal.getElement().pagination.goPrevPage();
		}
	}

	paint(RotationModal) {
		this.x = RotationModal.x + RotationModal.w - this.w - 5;
		this.y = RotationModal.y + 5;
		super.paint();
	}
}

class DownArrow extends ArrowButton {
	constructor() {
		super('interface/downArrow');
		this.id = 'downArrow';

		Button.push(this);
	}

	intersectionEvents() {
		if (this.intersects()) {
			const pag = Modal.getElement().pagination;
			pag.goNextPage();
		}
	}

	paint(RotationModal) {
		this.x = RotationModal.x + RotationModal.w - this.w - 5;
		this.y = RotationModal.y + RotationModal.h - this.h - 5;
		super.paint();
	}
}
