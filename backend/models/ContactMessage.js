const mongoose = require('mongoose');

const contactMessageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    lowercase: true
  },
  phone: { type: String, default: '' },
  subject: {
    type: String,
    required: [true, 'Subject is required'],
    trim: true
  },
  message: {
    type: String,
    required: [true, 'Message is required'],
    maxlength: [2000, 'Message too long']
  },
  isRead: { type: Boolean, default: false },
  repliedAt: { type: Date, default: null }
}, { timestamps: true });

module.exports = mongoose.model('ContactMessage', contactMessageSchema);
