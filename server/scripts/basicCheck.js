const Token = req('scripts/Token');

function basicCheck(id, data) {
	const token = Token.get(id);
	const result = {};
	if (!token.has(data.csrf_token) || data.honeypot !== '') {
		result.message = 'Token is expired';
		result.error = true;
		return result;
	}

	token.restore();
	return result;
}

basicCheck.isInteger = function (number) {
	return number.match(/^\d+$/);
};

basicCheck.checkRangeInputs = function (...numbers) {
	const integers = numbers.map((number) => {
		return this.isInteger(number);
	});

	const allAreIntegers = integers.every((integer) => integer !== null);
	if (!allAreIntegers) {
		return false;
	}

	const areInRange = integers.every((integer) => integer >= 6 && integer <= 60);
	if (!areInRange) {
		return false;
	}

	return true;
};

module.exports = basicCheck;
