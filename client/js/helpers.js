export const helpers = {
	getImage(name) {
		let image = new Image();
		image.src = `./client/img/${name}.png`;
		return image;
	},
	getModalPixelSize() {
		return 6;
	}
};
