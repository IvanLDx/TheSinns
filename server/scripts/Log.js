class Log {
	constructor() {}

	static trace(color, message) {
		const error = new Error(message);
		const filteredStack = error.stack
			.split('\n')
			.filter((line) => !['Module.', '\\Log.js', 'node:internal'].some((substring) => line.includes(substring)))
			.map((line, i) => (i === 0 ? line.replace(/^Error: /, 'Custom Log: ') : line))
			.join('\n');
		return console.log(`\x1b[${color}m%s\x1b[0m`, filteredStack);
	}

	static black(message) {
		return this.trace(30, message);
	}

	static red(message) {
		return this.trace(31, message);
	}

	static green(message) {
		return this.trace(32, message);
	}

	static yellow(message) {
		return this.trace(33, message);
	}

	static blue(message) {
		return this.trace(34, message);
	}

	static magenta(message) {
		return this.trace(35, message);
	}

	static cyan(message) {
		return this.trace(36, message);
	}

	static white(message) {
		return this.trace(37, message);
	}
}

module.exports = (message) => Log.black(message);
