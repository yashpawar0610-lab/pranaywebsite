const mongoose = require('mongoose');

const trainingBookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  trainer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Trainer',
    required: true
  },
  date: {
    type: Date,
    required: [true, 'Booking date is required']
  },
  timeSlot: {
    type: String,
    required: [true, 'Time slot is required']
  },
  sessionType: {
    type: String,
    enum: ['personal', 'group', 'online'],
    default: 'personal'
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed'],
    default: 'pending'
  },
  notes: { type: String, default: '' },
  cancellationReason: { type: String, default: '' }
}, { timestamps: true });

// Prevent duplicate bookings: same trainer, date, timeslot
trainingBookingSchema.index({ trainer: 1, date: 1, timeSlot: 1 }, { unique: true });

module.exports = mongoose.model('TrainingBooking', trainingBookingSchema);
