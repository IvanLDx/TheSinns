import { Container } from './Container.js';

export class Toolkit extends Container {
	constructor(mouse) {
		super();
		this.w = 100;
		this.h = 100;
		this.setPosition(mouse);
	}

	setPosition(mouse) {
		this.x = mouse.absoluteX + 20;
		this.y = mouse.absoluteY;
	}
}
