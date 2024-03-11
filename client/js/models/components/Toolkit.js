import { utils } from '../../utils.js';
import { Container } from './Container.js';
import { ModalItem } from '../Item/ModalItem.js';
import { WorldItem } from '../Item/WorldItem.js';
import { Button } from './Button.js';
import { Tile } from '../Tile.js';

export class Toolkit extends Container {
	constructor(mouse) {
		super();
		this.w = 300;
		this.h = 50;
		this.padding = 10;
		this.list = [];
		this.#setPosition(mouse);
	}

	#setIntersectedList() {
		this.list = [];
		Button.list.forEach((item) => {
			if (mouse.absoluteIntersects(item)) {
				this.list.push(item);
			}
		});

		ModalItem.each((item) => {
			if (mouse.absoluteIntersectsInModal(item)) {
				this.list.push(item);
			}
		});

		Tile.each((item) => {
			if (item.touch) {
				this.list.push(item);

				WorldItem.list
					.filter((worldItem) => {
						return item.id === worldItem.touchedTile.id;
					})
					.forEach((worldItem) => {
						this.list.push(worldItem);
					});
			}
		});
	}

	handleEvents(mouse) {
		this.#setPosition(mouse);
		this.#setIntersectedList();

		if (this.list.length == 0) {
			this.h = 50;
		} else {
			this.h = this.list.length * (40 + this.padding) + this.padding;
		}
	}

	drawContent() {
		let currentY = this.y + this.padding;

		this.list.forEach((item, i) => {
			const image = item.image || item.swatch;
			const rectPosition = [this.x + this.padding, currentY, 40, 40];
			if (typeof image === 'object') {
				ctx.drawImage(
					image,
					0,
					0,
					item.imageSize || item.imageWidth || item.w,
					item.imageSize || item.imageHeight || item.h,
					...rectPosition
				);
			} else {
				ctx.fillStyle = image;
				ctx.fillRect(...rectPosition);
			}

			ctx.font = '16px Segoe UI';
			ctx.fillStyle = '#374a6d';
			ctx.fillText(
				'Class ' +
					item.constructor.name +
					(item.type ? ` - ${item.type}` : ''),
				this.x + this.padding + 50,
				currentY + 14
			);

			currentY += 50;
		});
	}

	#setPosition(mouse) {
		let isCroppedRight = mouse.absoluteX + this.w > cv.width - 40;
		if (isCroppedRight) {
			this.x = mouse.absoluteX - this.w - 10;
		} else {
			this.x = mouse.absoluteX + 20;
		}

		let isCroppedBottom = mouse.absoluteY + this.h > cv.height - 20;
		if (isCroppedBottom) {
			this.y = mouse.absoluteY - this.h + 20;
		} else {
			this.y = mouse.absoluteY;
		}
	}
}
