const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../../models');
const { secretKey } = require("../../keys");

module.exports = {
	createUser: async (args) => {
		try {
			const { email, password } = args.input;
			const user = await User.findOne({ email });
			if (user) {
				throw new Error('User already exists');
			}
			const hashedPass = await bcrypt.hash(password, 12);
			const newUser = new User({
				email,
				password: hashedPass
			});
			const result = await newUser.save();
			return { ...result._doc, _id: result.id, password: null };
		} catch (err) {
			throw err;
		}
	},
	login: async (args) => {
		try {
			const { email, password } = args;
			const user = await User.findOne({ email });
			if (!user) throw new Error('Invalid creadential!');

			const isEqual = await bcrypt.compare(password, user.password);
			if (!isEqual) throw new Error('Invalid creadential!');

			const token = jwt.sign({ userId: user.id, email }, secretKey, {
				expiresIn: '1h'
			});
			return { userId: user.id, token, tokenExpiration: 1 };
		} catch (err) {
			throw err;
		}
	}
};
