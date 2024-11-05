const utils = require('./utils');

class Middleware {
	login(req, res, next) {
		console.info(req.session);
		if (!req.session || (req.session && !req.session.userId)) {
			const path = utils.getPath('pages/login');
			res.render('login', { path: path });
		} else {
			next();
		}
	}

	csrf(req, res, next) {
		const response = {};
		const token = req.body.csrf;
		response.origin = 'csrf';

		if (!token || !Token.exists(req.sessionID, token)) {
			response.message = 'Expirou a sesión';
			response.error = true;
			res.send(response);
		} else {
			next();
		}
	}

	static get() {
		if (!this.element) {
			this.element = new Middleware();
		}
		return this.element;
	}

	static element = null;
}

module.exports = Middleware;
