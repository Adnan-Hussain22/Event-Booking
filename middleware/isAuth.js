const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
	try {
		const authHeader = req.get('Authorization');
		if (!authHeader) throw new Error('');

		const token = authHeader.split(' ')[1];
		if (!token) throw new Error('');

		const decodedToken = jwt.verify(token, 'secretKey');
		if (!decodedToken) throw new Error('');

		req.isAuth = true;
		req.userId = decodedToken.userId;
	} catch (err) {
		req.isAuth = false;
		req.next();
	}
};
