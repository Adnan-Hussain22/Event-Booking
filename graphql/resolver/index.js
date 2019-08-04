const eventResolvers = require('./event');
const bookingResolvers = require('./booking');
const authResolvers = require('./auth');
module.exports = {
	...eventResolvers,
	...bookingResolvers,
	...authResolvers
};
