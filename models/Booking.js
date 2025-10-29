const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
	guestName: { type: String, required: true, trim: true },
	guestEmail: { type: String, required: true, trim: true, lowercase: true },
	roomNumber: { type: String, required: true, trim: true },
	checkIn: { type: Date, required: true },
	checkOut: { type: Date, required: true },
	notes: { type: String, default: '' }
}, {
	timestamps: true
});

module.exports = mongoose.models?.Booking || mongoose.model('Booking', bookingSchema);
