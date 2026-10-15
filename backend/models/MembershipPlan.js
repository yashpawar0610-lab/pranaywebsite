const mongoose = require('mongoose');

const membershipPlanSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Plan name is required'],
    unique: true,
    trim: true
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  duration: {
    type: Number,
    required: [true, 'Duration is required'],
    comment: 'Duration in months'
  },
  features: [{
    type: String,
    trim: true
  }],
  description: { type: String, trim: true },
  isPopular: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  color: { type: String, default: '#84cc16' },
  maxSessions: { type: Number, default: null }
}, { timestamps: true });

module.exports = mongoose.model('MembershipPlan', membershipPlanSchema);
