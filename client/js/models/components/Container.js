export class Container {
	constructor(x, y, w, h) {
		this.x = x || 10;
		this.y = y || 0;
		this.w = w || 0;
		this.h = h || 200;
		this.strokeColor = '#2c4371';
		this.fillColor = '#e2b332';
	}

	paint() {
		ctx.strokeStyle = this.strokeColor;
		ctx.lineWidth = 8;
		ctx.strokeRect(this.x, this.y, this.w, this.h);

		ctx.fillStyle = this.fillColor;
		ctx.fillRect(this.x, this.y, this.w, this.h);
	}

	static element = null;
}
