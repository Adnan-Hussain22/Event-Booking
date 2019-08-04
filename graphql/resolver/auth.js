const bcrypt = require('bcryptjs');
const { User } = require('../../models');
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
};