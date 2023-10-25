export const utils = {
	getImage(name) {
		let image = new Image();
		image.src = `./client/img/${name}.png`;
		return image;
	},
	getModalPixelSize() {
		return 6;
	},
	paintSettings() {
		ctx.globalAlpha = 1;
		ctx.fillStyle = '#64e29d';
		ctx.fillRect(0, 0, cv.width, cv.height);
		ctx.imageSmoothingEnabled = false;
	}
};
