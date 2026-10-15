const mongoose = require('mongoose');

const membershipSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  plan: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MembershipPlan',
    required: true
  },
  startDate: {
    type: Date,
    required: true,
    default: Date.now
  },
  endDate: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'expired', 'pending', 'cancelled'],
    default: 'pending'
  },
  paymentStatus: {
    type: String,
    enum: ['paid', 'pending', 'demo'],
    default: 'demo'
  },
  amountPaid: { type: Number, default: 0 },
  notes: { type: String, default: '' }
}, { timestamps: true });

// Auto-set status based on dates
membershipSchema.pre('save', function (next) {
  const now = new Date();
  if (this.endDate < now) {
    this.status = 'expired';
  } else if (this.startDate <= now && this.endDate >= now) {
    this.status = 'active';
  }
  next();
});

module.exports = mongoose.model('Membership', membershipSchema);
