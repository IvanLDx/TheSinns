import { $ } from '../dom.js';

class Stage {
	constructor() {
		this.body = document.body;
		this.login = 'login';
		this.menu = 'menu';
		this.world = 'world';
	}

	change(stage) {
		if (this[stage]) {
			this.body.setAttribute('data-stage', this[stage]);
		}
	}

	sendDisconnectedMsg() {
		const $disconnectedMsg = $('.disconnected-msg');
		$disconnectedMsg.addClass('show');
		setTimeout(() => {
			$disconnectedMsg.removeClass('show');
		}, 5000);
	}

	static get() {
		if (!this.instance) {
			this.instance = new Stage();
		}

		return this.instance;
	}

	static instance = null;
}

export const stage = Stage.get();
