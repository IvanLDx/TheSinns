export class Modal {
	constructor(x, y, w, h) {
		this.x = x || 0;
		this.y = y || 0;
		this.w = w || 0;
		this.h = h || 0;
	}

	resize() {
		this.x = 10;
		this.y = cv.height - 210;
		this.w = cv.width - 20;
		this.h = 200;
	}

	paint() {
		ctx.strokeStyle = '#2c4371';
		ctx.lineWidth = 8;
		ctx.strokeRect(this.x, this.y, this.w, this.h);
		ctx.fillStyle = '#e2b332';
		ctx.fillRect(this.x, this.y, this.w, this.h);
	}
}