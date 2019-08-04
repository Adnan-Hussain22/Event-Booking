const { Event, User, Booking } = require('../../models');
const bcrypt = require('bcryptjs');
const user = async (userId) => {
	try {
		const user = await User.findById(userId);
		return {
			...user._doc,
			_id: user.id,
			password: null,
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
				creator: user.bind(this, event.creator)
			};
		});
	} catch (err) {
		throw err;
	}
};

const singleEvent = async (eventId) => {
	try {
		const event = await Event.findById(eventId);
		return {
			...event._doc,
			_id: event.id,
			creator: user.bind(this, event.creator)
		};
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
					creator: user.bind(this, event._doc.creator)
				};
			});
		} catch (err) {
			throw err;
		}
	},
	bookings: async () => {
		try {
			const bookings = await Booking.find();
			return bookings.map((booking) => {
				return {
					...booking._doc,
					_id: booking.id,
					user: user.bind(this, booking._doc.user),
					event: singleEvent.bind(this, booking._doc.event),
					createdAt: new Date(booking._doc.createdAt).toISOString(),
					updatedAt: new Date(booking._doc.updatedAt).toISOString()
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
				creator: '5d4692fb3cc78a25accf891b'
			});
			const eventResult = await event.save();
			const user = await User.findById('5d4692fb3cc78a25accf891b');
			if (!user) throw new Error('User not found');
			user.createdEvents.push(createdEvent);
			await user.save();
			return {
				...eventResult._doc,
				_id: eventResult.id,
				creator: user.bind(this, eventResult._doc.creator)
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
			const hashedPass = await bcrypt.hash(password, 12);
			const newUser = new User({
				email,
				password: hashedPass
			});
			const result = await newUser.save();
			return { ...result._doc, _id: result.id };
		} catch (err) {
			throw err;
		}
	},
	bookEvent: async (args) => {
		try {
			const { eventId } = args;
			const booking = new Booking({
				user: '5d4692fb3cc78a25accf891b',
				event: eventId
			});
			const result = await booking.save();
			return {
				...result._doc,
				_id: result.id,
				user: user.bind(this, booking._doc.user),
				event: singleEvent.bind(this, booking._doc.event),
				createdAt: new Date(result._doc.createdAt).toISOString(),
				updatedAt: new Date(result._doc.updatedAt).toISOString()
			};
		} catch (err) {
			throw err;
		}
	},
	cancelBooking: async (args) => {
		try {
			const { bookingId } = args;
			const booking = await Booking.findById(bookingId).populate("event")
			const event = {
				...booking.event._doc,
				_id: booking.id,
				creator: user.bind(this, booking.event._doc.creator)
			};
			await Booking.deleteOne({ _id: bookingId });
			return event;
		} catch (err) {
			throw err;
		}
	}
};
