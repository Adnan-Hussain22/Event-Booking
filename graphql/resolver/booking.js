const { Booking } = require('../../models');
const { populateEvent, populateBooking } = require('./populators');
module.exports = {
	bookings: async () => {
		try {
			const bookings = await Booking.find();
			return bookings.map((booking) => populateBooking(booking));
		} catch (err) {
			throw err;
		}
	},
	bookEvent: async (args) => {
		try {
			const { eventId } = args;
			const booking = new Booking({
				user: '5d46a32a74813a135c02a8df',
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
