const { events, createEvent } = require('./event');
const { bookEvent, bookings, cancelBooking } = require('./booking');
const { createUser } = require('./auth');
module.exports = {
	events,
	bookings,
	createEvent,
	createUser,
	bookEvent,
	cancelBooking
};
