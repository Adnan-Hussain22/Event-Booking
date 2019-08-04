const { Event, User } = require('../../models');
const { populateEvent } = require('./populators');
module.exports = {
	events: async () => {
		try {
			const events = await Event.find();
			return events.map((event) => populateEvent(event));
		} catch (err) {
			throw err;
		}
	},
	createEvent: async (args) => {
		try {
			const { title, description, price, date } = args.input;
			const event = new Event({
				title,
				description,
				price,
				date: new Date(date),
				creator: '5d46a32a74813a135c02a8df'
			});
			const eventResult = await event.save();
			const user = await User.findById('5d46a32a74813a135c02a8df');
			if (!user) throw new Error('User not found');
			user.createdEvents.push(event);
			await user.save();
			return populateEvent(eventResult);
		} catch (err) {
			throw err;
		}
	}
};
