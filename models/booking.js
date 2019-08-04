const mongoose = require('mongoose');
const { Schema } = mongoose;

const bookingSchema = new Schema(
	{
		event: {
			type: Schema.Types.ObjectId,
			ref: 'Event'
		},
		user: {
			type: Schema.Types.ObjectId,
			ref: 'User'
		}
	},
	{ versionKey: false, timestamps: true }
);

module.exports = mongoose.model('Booking', bookingSchema);
