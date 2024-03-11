import { Socket } from '../../Socket.js';
import { Button } from '../Button.js';

export class ModalButton extends Button {
	constructor(type, modal, i) {
		super('interface/' + type);
		this.modal = modal;
		this.imageSize = 10;
		this.w = modal.w - 10;
		this.h = this.w;
		this.i = i;
		this.x = this.modal.x + 5;
		this.marginTop = 10;
		this.y = this.#setY();
		this.type = type;

		Button.push(this);
	}

	#setY() {
		return (
			this.marginTop * (this.i + 1) +
			this.modal.y +
			this.modal.contractHeight +
			this.modal.contractHeight * this.i
		);
	}

	#getPercentageImageSight() {
		let inModalHeight = this.modal.y + this.modal.h - this.y;
		let height = this.h;
		if (inModalHeight < height) {
			if (inModalHeight <= 0) {
				height = 0;
			} else {
				height = inModalHeight;
			}
		}
		return height / this.h;
	}

	paintImage() {
		let percentage = this.#getPercentageImageSight();
		ctx.drawImage(
			this.image,
			0,
			0,
			this.imageSize,
			this.imageSize * percentage,
			this.x,
			this.y,
			this.w,
			this.h * percentage
		);
	}

	static create(type, modal, i) {
		let button = null;
		switch (type) {
			case 'save':
				button = new SaveButton(type, modal, i);
				break;
			case 'open':
				button = new OpenButton(type, modal, i);
				break;
			case 'toolkit':
				button = new ToolkitButton(type, modal, i);
		}

		return button;
	}
}

class SaveButton extends ModalButton {
	constructor(type, modal, i) {
		super(type, modal, i);
	}
	intersectionEvents() {
		if (this.intersects()) {
			Socket.saveWorld();
		}
	}
}

class OpenButton extends ModalButton {
	intersectionEvents() {
		if (this.intersects()) {
		}
	}
}

class ToolkitButton extends ModalButton {
	intersectionEvents() {
		if (this.intersects()) {
			mouse.toggleToolkit();
		}
	}
}
