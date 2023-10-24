import { Button } from './Button.js';

export class OptionButton extends Button {
	constructor() {
		super();
		this.w = 30;
		this.marginRight = 20;
		this.gap = 16;

		Button.push(this);
	}
}
