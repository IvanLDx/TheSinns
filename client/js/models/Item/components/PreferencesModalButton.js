import { Container } from '../../components/Container.js';

export class PreferencesModalButton extends Container {
	constructor(worldItem, x, y) {
		super();
		this.id = worldItem.id;
		this.name = worldItem.name;
		this.size = 40;
		this.x = x + worldItem.position.w / 2;
		this.y = y + worldItem.position.h / 2;
		this.w = worldItem.w;
		this.h = worldItem.h;
		this.image = worldItem.image;
		this.locationType = worldItem.locationType;
		this.rotation = worldItem.rotation;
		this.type = worldItem.type;
		this.url = worldItem.url;
	}

	paint() {
		ctx.beginPath();
		ctx.fillStyle = this.fillColor;
		ctx.strokeStyle = this.strokeColor;
		ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
		ctx.fill();
		ctx.stroke();
	}

	static create(touchedItems, size) {
		const buttons = [];
		const sourceX = touchedItems[0].position.x;
		const sourceY = touchedItems[0].position.y;

		// To modify position in circle, use:
		// 0 to put in perfect axis alignment
		// -1/1 to use diagonal positions
		// -1.57 begin on Top instead of Right
		const position = -1.57;
		touchedItems.forEach((item, i) => {
			const degrees = (i * 2 * Math.PI) / touchedItems.length + position;
			const x = sourceX + size * Math.cos(degrees);
			const y = sourceY + size * Math.sin(degrees);
			buttons.push(new PreferencesModalButton(item, x, y));
		});

		return buttons;
	}
}
