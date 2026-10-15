const { validationResult } = require('express-validator');
const ContactMessage = require('../models/ContactMessage');

// @desc   Submit contact message
// @route  POST /api/contact
// @access Public
const submitContact = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: errors.array()[0].msg });
    }

    const { name, email, phone, subject, message } = req.body;
    await ContactMessage.create({ name, email, phone: phone || '', subject, message });
    res.status(201).json({
      success: true,
      message: 'Thank you! Your message has been received. We will get back to you soon.'
    });
  } catch (error) { next(error); }
};

// @desc   Get all contact messages (Admin)
// @route  GET /api/contact
// @access Admin
const getMessages = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const filter = {};
    if (req.query.isRead !== undefined) filter.isRead = req.query.isRead === 'true';

    const total = await ContactMessage.countDocuments(filter);
    const messages = await ContactMessage.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit).limit(limit);

    res.status(200).json({
      success: true,
      data: messages,
      pagination: { total, page, pages: Math.ceil(total / limit) }
    });
  } catch (error) { next(error); }
};

// @desc   Mark message as read (Admin)
// @route  PUT /api/contact/:id/read
// @access Admin
const markAsRead = async (req, res, next) => {
  try {
    const msg = await ContactMessage.findByIdAndUpdate(
      req.params.id, { isRead: true }, { new: true }
    );
    if (!msg) return res.status(404).json({ success: false, message: 'Message not found.' });
    res.status(200).json({ success: true, message: 'Marked as read.', data: msg });
  } catch (error) { next(error); }
};

// @desc   Delete contact message (Admin)
// @route  DELETE /api/contact/:id
// @access Admin
const deleteMessage = async (req, res, next) => {
  try {
    const msg = await ContactMessage.findByIdAndDelete(req.params.id);
    if (!msg) return res.status(404).json({ success: false, message: 'Message not found.' });
    res.status(200).json({ success: true, message: 'Message deleted.' });
  } catch (error) { next(error); }
};

module.exports = { submitContact, getMessages, markAsRead, deleteMessage };
