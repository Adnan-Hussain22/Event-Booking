const { Event, User } = require('../../models');
const bcrypt = require('bcryptjs');
const users = async (userId) => {
	try {
		const user = await User.findById(userId);
		return {
			...user._doc,
			_id: user.id,
			createdEvents: events.bind(this, user._doc.createdEvents)
		};
	} catch (err) {
		throw err;
	}
};

const events = async (eventIds) => {
	try {
		const events = await Event.find({ _id: { $in: eventIds } });
		return events.map((event) => {
			return {
				...event._doc,
				_id: event.id,
				creator: users.bind(this, event.creator)
			};
		});
	} catch (err) {
		throw err;
	}
};

module.exports = {
	events: async () => {
		try {
			const events = await Event.find();
			return events.map((event) => {
				return {
					...event._doc,
					_id: event.id,
					creator: users.bind(this, event._doc.creator)
				};
			});
		} catch (err) {
			throw err;
		}
	},
	createEvent: async (args) => {
		try {
			const { title, description, price, date } = args.input;
			let createdEvent = null;
			const event = new Event({
				title,
				description,
				price,
				date: new Date(date),
				creator: '5d406930fc467c219c09bbee'
			});
			const eventResult = await event.save();
			const user = await User.findById('5d406930fc467c219c09bbee');
			if (!user) throw new Error('User not found');
			user.createdEvents.push(createdEvent);
			await user.save();
			return {
				...eventResult._doc,
				_id: eventResult.id,
				creator: users.bind(this, eventResult._doc.creator)
			};
		} catch (err) {
			throw err;
		}
	},
	createUser: async (args) => {
		try {
			const { email, password } = args.input;
			const user = await User.findOne({ email });
			if (user) {
				throw new Error('User already exists');
			}
			const hashedPass = bcrypt.hash(password, 12);
			const newUser = new User({
				email,
				password: hashedPass
			});
			const result = await newUser.save();
			return { ...result._doc, _id: result.id };
		} catch (err) {
			throw err;
		}
	}
};
