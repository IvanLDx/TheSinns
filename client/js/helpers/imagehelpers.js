export const imageHelpers = {
	getImage(name) {
		let image = new Image();
		image.src = `./client/img/${name}.png`;
		return image;
	},
	getWorldItemImage(name) {
		return this.getImage(`worldItems/${name}`);
	},
	drawImage(image, source, destination) {
		ctx.drawImage(image, source.x, source.y, source.w, source.h, destination.x, destination.y, destination.w, destination.h);
	},
	getSource(imageSize) {
		return {
			x: 0,
			y: 0,
			w: imageSize,
			h: imageSize
		};
	}
};
