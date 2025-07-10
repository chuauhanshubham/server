const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  tripType: {
    type: String,
    enum: ['one-way', 'round-trip', 'airport', 'hourly'],
    required: true
  },
  fromCity: {
    type: String,
    required: true
  },
  toCity: {
    type: String,
    required: true
  },
  departureDate: {
    type: Date,
    required: true
  },
  returnDate: Date,
  pickupTime: String,
  status: {
    type: String,
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Booking', BookingSchema);