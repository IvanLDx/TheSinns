export class Button {
	constructor() {
		this.x = 0;
		this.y = 0;
		this.h = 30;
	}

	repositioning() {
		this.y = cv.height - 230;
	}

	paint() {
		ctx.strokeStyle = '#2c4371';
		ctx.lineWidth = 8;
		ctx.strokeRect(this.x, this.y, this.w, this.h);

		ctx.fillStyle = '#e2b332';
		ctx.fillRect(this.x, this.y, this.w, this.h);
	}

	static each(evt) {
		this.list.forEach((button, i) => {
			evt(button, i);
		});
	}

	static push(button) {
		this.list.push(button);
	}

	static list = [];
}
