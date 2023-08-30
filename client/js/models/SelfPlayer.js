import { Entity } from './Entity.js';

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

	static create(players, id) {
		Entity.players = players;
		players
			.filter((player) => {
				return player.id === id;
			})
			.forEach((player) => {
				Entity.selfPlayer = new SelfPlayer(player);
			});
	}
}
