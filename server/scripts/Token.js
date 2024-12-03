const utils = require('./utils');

class Token {
	constructor(sessionID) {
		this.sessionID = sessionID;
		this.hex = '123456789abcdef';
		this.format = '########-####-####-####-############';
		this.expiringTime = utils.getMinutes(10);
		this.value = this.setValue();
		this.timeout = null;
		this.callback = null;
	}

	restore() {
		clearTimeout(this.timeout);

		this.timeout = this.setTimeout();
	}

	setTimeout() {
		return setTimeout(() => {
			Token.map.delete(this.sessionID);
			if (this.callback) {
				this.callback();
			}
		}, this.expiringTime);
	}

	setValue() {
		let chars = this.hex;
		let token = this.format;
		do {
			let newChar = chars[Math.floor(Math.random() * chars.length)];
			token = token.replace('#', newChar);
		} while (token.match('#'));
		return token;
	}

	has(csrfToken) {
		return this.value && this.value === csrfToken;
	}

	static create(sessionID, callback) {
		const token = new Token(sessionID);
		token.callback = callback;
		token.timeout = token.setTimeout();

		this.map.set(sessionID, token);
		return token;
	}

	static get(sessionID) {
		return this.map.get(sessionID);
	}

	static map = new Map();
}

module.exports = Token;
