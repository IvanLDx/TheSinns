export class Camera {
	constructor() {
		this.x = 0;
		this.y = 0;
		this.pixelSize = 4;
	}

	focus(cv, player) {
		let x = player.x + player.w / 2;
		let y = player.y + player.h / 2;
		this.x = x * this.pixelSize - cv.width / 2;
		this.y = y * this.pixelSize - cv.height / 2;
	}

	resize(cv) {
		cv.width = this.getScreenSize(cv.clientWidth);
		cv.height = this.getScreenSize(cv.clientHeight);
	}

	getScreenSize(size) {
		let calc = size;
		while (calc % 4 !== 0) {
			calc++;
		}
		this.needsResize = false;
		return calc;
	}

	zoom(e) {
		if (e.deltaY < 0 && this.pixelSize < 40) {
			this.pixelSize++;
		} else if (e.deltaY > 0 && this.pixelSize > 1) {
			this.pixelSize--;
		}
	}
}
