class Token {
	constructor() {
		this.hex = '123456789abcdef';
		this.format = '########-####-####-####-############';
		this.expiringTime = this.getMinutes(0.1);
		this.tokens = new Map();
	}

	createToken() {
		let chars = this.hex;
		let token = this.format;
		do {
			let newChar = chars[Math.floor(Math.random() * chars.length)];
			token = token.replace('#', newChar);
		} while (token.match('#'));
		return token;
	}

	create(sessionID, expirationCallback) {
		const token = this.createToken();
		this.get(sessionID);
		this.get(sessionID).add(token);
		setTimeout(() => {
			this.get(sessionID).delete(token);
			expirationCallback(sessionID);
		}, this.expiringTime);

		return token;
	}

	getMinutes(minutes) {
		return 1000 * 60 * minutes;
	}

	get(sessionID) {
		let session = this.tokens.get(sessionID);
		if (!session) {
			session = this.set(sessionID);
		}
		return session;
	}

	set(sessionID) {
		return this.tokens.set(sessionID, new Set());
	}

	exists(sessionID, csrf) {
		return this.get(sessionID).has(csrf);
	}

	restore(sessionID, csrf) {
		this.get(sessionID).delete(csrf);
		return this.create(sessionID);
	}

	static get() {
		if (!this.element) {
			this.element = new Token();
		}
		return this.element;
	}

	static element = null;
}

module.exports = Token;
