class IdentityCreation {
	constructor() {
		this.formats = {
			uuid: '########-####-####-####-############',
			id: '########'
		};

		this.types = {
			hex: '123456789abcdef'
		};
	}

	setValue(options) {
		let token;
		switch (options.type) {
			case 'nameAndDate':
				const time = new Date().getTime();
				const formattedName = options.name.replaceAll(' ', '_');
				token = `${formattedName}-${time}`;
				break;
			default:
				let chars = this.types[options.type];
				token = this.formats[options.format];

				do {
					let newChar = chars[Math.floor(Math.random() * chars.length)];
					token = token.replace('#', newChar);
				} while (token.match('#'));
				break;
		}

		return token;
	}

	static get() {
		if (!this.instance) {
			this.instance = new IdentityCreation();
		}

		return this.instance;
	}

	static instance = null;
}

module.exports = IdentityCreation;
