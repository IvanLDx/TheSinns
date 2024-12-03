import { imageHelpers } from '../../../helpers/imagehelpers.js';
import { OptionItem } from './OptionItem.js';
import { OptionButton } from './OptionButton.js';
import { Modal } from './Modal.js';

class AllTypes extends OptionItem {
	constructor() {
		const list = [new Roof(), new Wall(), new WallElement(), new Decoration(), new Floor()];

		super(list);
	}
}

export class ItemType extends OptionButton {
	constructor(id) {
		super();
		this.id = id;
		this.buttonType = 'itemType';
		this.swatch = this.getImage();
	}

	intersectionEvents() {
		if (this.intersects()) {
			Modal.getElement().setType(this.id);
		}
	}

	repositioning(i) {
		super.repositioning();
		let totalItemTypeWidth = this.w * i;
		this.x = totalItemTypeWidth + this.marginRight + this.gap * i;
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

	getImage() {
		return imageHelpers.getImage('/swatches/' + this.id);
	}

	static get() {
		return new AllTypes();
	}
}

class Roof extends ItemType {
	constructor() {
		super('roof');
	}
}

class Wall extends ItemType {
	constructor() {
		super('wall');
	}
}

class WallElement extends ItemType {
	constructor() {
		super('wallElement');
	}
}

class Decoration extends ItemType {
	constructor() {
		super('decoration');
	}
}

class Floor extends ItemType {
	constructor() {
		super('floor');
	}
}
