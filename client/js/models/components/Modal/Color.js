import { OptionItem } from './OptionItem.js';
import { OptionButton } from './OptionButton.js';
import { Modal } from './Modal.js';

class AllColors extends OptionItem {
	constructor() {
		const list = [new Yellow(), new Red(), new Blue(), new Green()];
		super(list);
	}
}

export class Color extends OptionButton {
	constructor() {
		super();
		this.buttonType = 'color';
		Color.list.push(this);
	}

	intersectionEvents() {
		if (this.intersects()) {
			Modal.getElement().setColor(this.id);
		}
	}

	repositioning(i) {
		super.repositioning();
		let totalColorWidth = this.w * (i + 1);
		this.x = cv.width - totalColorWidth - this.marginRight - this.gap * i;
	}

	paint() {
		super.paint();
		ctx.fillStyle = this.swatch;
		ctx.fillRect(this.x + 5, this.y + 5, this.w - 10, this.h - 10);
	}

	static get() {
		return new AllColors();
	}
}

class Yellow extends Color {
	constructor() {
		super();
		this.id = 'yellow';
		this.swatch = '#e6c26c';
	}
}

class Red extends Color {
	constructor() {
		super();
		this.id = 'red';
		this.swatch = '#eb9486';
	}
}

class Blue extends Color {
	constructor() {
		super();
		this.id = 'blue';
		this.swatch = '#6c8bd5';
	}
}

class Green extends Color {
	constructor() {
		super();
		this.id = 'green';
		this.swatch = '#89b188';
	}
}
