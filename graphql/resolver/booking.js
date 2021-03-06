const { Booking } = require('../../models');
const { populateEvent, populateBooking } = require('./populators');
module.exports = {
	bookings: async (args, req) => {
		try {
			if (!req.isAuth) {
				throw new Error('User not authenticated!');
			}
			const bookings = await Booking.find();
			return bookings.map((booking) => populateBooking(booking));
		} catch (err) {
			throw err;
		}
	},
	bookEvent: async (args, req) => {
		try {
			if (!req.isAuth) {
				throw new Error('User not authenticated!');
			}
			const { eventId } = args;
			const booking = new Booking({
				user: req.userId,
				event: eventId
			});
			const result = await booking.save();
			return populateBooking(result);
		} catch (err) {
			throw err;
		}
	},
	cancelBooking: async (args) => {
		try {
			const { bookingId } = args;
			const booking = await Booking.findById(bookingId).populate('event');
			const event = populateEvent(booking.event);
			await Booking.deleteOne({ _id: bookingId });
			return event;
		} catch (err) {
			throw err;
		}
	}
};
