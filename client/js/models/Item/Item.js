import { utils } from '../../utils.js';
import { imageHelpers } from '../../helpers/imagehelpers.js';
import { List } from '../List.js';

export class Item extends List {
	constructor(item) {
		super();
		this.x = item.x || 0;
		this.y = item.y || 0;
		this.w = item.w || 0;
		this.h = item.h || 0;
		this.type = utils.getFolder(item.url) || null;
		this.url = item.url || '/';
		this.name = item.name || 'default';
		this.image = imageHelpers.getImage(item.url + '/' + item.name);
		this.rotation = item.rotation || 0;
		this.#setMaxRotationWhenImageLoads();
	}

	#setMaxRotationWhenImageLoads() {
		this.image.addEventListener('load', () => {
			this.maxRotation = this.image.width / this.w - 1;
		});
	}

	paint() {
		if (this.touchedByMouse) {
			ctx.globalAlpha = 0.7;
		}

		imageHelpers.drawImage(
			this.image,
			{
				x: this.rotation * this.w,
				y: 0,
				w: this.w,
				h: this.h
			},
			{
				x: this.position.x,
				y: this.destinationY || this.position.y,
				w: this.position.w,
				h: this.position.h
			}
		);

		ctx.globalAlpha = 1;
	}

	rotateRight() {
		if (this.rotation <= 0) {
			this.rotation = this.maxRotation;
		} else {
			this.rotation--;
		}
	}

	rotateLeft() {
		if (this.rotation >= this.maxRotation) {
			this.rotation = 0;
		} else {
			this.rotation++;
		}
	}
}
