export class SelfPlayer {
	constructor(player) {
		this.x = player.x;
		this.y = player.y;
		this.w = player.w;
		this.h = player.h;
		this.id = player.id;
	}

	updatePosition() {
		this.x += mouse.drag.x;
		this.y += mouse.drag.y;
	}

	moveTo(x, y) {
		this.x = x;
		this.y = y;
	}

	static create(players, id) {
		players
			.filter((player) => {
				return player.id === id;
			})
			.forEach((player) => {
				this.element = new SelfPlayer(player);
			});

		return this.get();
	}

	static get() {
		return this.element;
	}

	static element = null;
}
