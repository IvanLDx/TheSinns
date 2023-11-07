import { Button } from '../Button.js';

export class ModalButton extends Button {
	constructor(image, modal) {
		super('interface/' + image);
		this.modal = modal;
		this.w = modal.w;
		this.h = modal.h;
	}

	paintImage() {
		let inModalHeight = this.modal.y + this.modal.h - this.y;
		let height = this.h;
		if (inModalHeight < height) {
			if (inModalHeight <= 0) {
				height = 0;
			} else {
				height = inModalHeight;
			}
		}
		ctx.drawImage(
			this.image,
			0,
			0,
			this.w,
			height,
			this.x,
			this.y,
			this.w,
			height
		);
	}
}
