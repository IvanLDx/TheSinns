import { utils } from '../../../utils.js';
import { OptionItem } from './OptionItem.js';
import { OptionButton } from './OptionButton.js';
import { Modal } from './Modal.js';

class AllTypes extends OptionItem {
	constructor() {
		const list = [
			new Wall(),
			new WallElement(),
			new Decoration(),
			new Floor()
		];

		super(list);
	}
}

export class ItemType extends OptionButton {
	constructor(id) {
		super();
		this.id = id;
		this.buttonType = 'itemType';
		this.swatch = this.getImage();

		ItemType.list.push(this);
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
		ctx.drawImage(
			this.swatch,
			0,
			0,
			10,
			10,
			this.x + 3,
			this.y + 3,
			this.w - 6,
			this.h - 6
		);
	}

	getImage() {
		return utils.getImage('/swatches/' + this.id);
	}

	static get() {
		return new AllTypes();
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
