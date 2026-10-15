const mongoose = require('mongoose');

const trainerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Trainer name is required'],
    trim: true
  },
  specialization: {
    type: String,
    required: [true, 'Specialization is required']
  },
  experience: {
    type: Number,
    required: [true, 'Experience is required'],
    comment: 'Years of experience'
  },
  bio: { type: String, default: '' },
  certifications: [{ type: String }],
  categories: [{ type: String }],
  image: { type: String, default: '' },
  email: { type: String, default: '' },
  phone: { type: String, default: '' },
  rating: { type: Number, default: 4.5, min: 0, max: 5 },
  totalClients: { type: Number, default: 0 },
  availableSlots: [{
    day: { type: String },
    time: { type: String },
    isBooked: { type: Boolean, default: false }
  }],
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Trainer', trainerSchema);
