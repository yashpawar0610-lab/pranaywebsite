const TrainingBooking = require('../models/TrainingBooking');
const Trainer = require('../models/Trainer');

// @desc   Create a booking
// @route  POST /api/bookings
// @access Private
const createBooking = async (req, res, next) => {
  try {
    const { trainerId, date, timeSlot, sessionType, notes } = req.body;

    const trainer = await Trainer.findById(trainerId);
    if (!trainer) return res.status(404).json({ success: false, message: 'Trainer not found.' });

    // Check if slot already booked
    const existing = await TrainingBooking.findOne({
      trainer: trainerId,
      date: new Date(date),
      timeSlot,
      status: { $nin: ['cancelled'] }
    });
    if (existing) {
      return res.status(400).json({ success: false, message: 'This time slot is already booked. Please choose another.' });
    }

    // Check user doesn't have another booking same time
    const userBooking = await TrainingBooking.findOne({
      user: req.user._id,
      date: new Date(date),
      timeSlot,
      status: { $nin: ['cancelled'] }
    });
    if (userBooking) {
      return res.status(400).json({ success: false, message: 'You already have a booking at this time.' });
    }

    const booking = await TrainingBooking.create({
      user: req.user._id,
      trainer: trainerId,
      date: new Date(date),
      timeSlot,
      sessionType: sessionType || 'personal',
      notes: notes || ''
    });

    const populated = await booking.populate([
      { path: 'trainer', select: 'name specialization image' },
      { path: 'user', select: 'name email' }
    ]);

    res.status(201).json({ success: true, message: 'Booking created successfully!', data: populated });
  } catch (error) { next(error); }
};

// @desc   Get my bookings
// @route  GET /api/bookings/my
// @access Private
const getMyBookings = async (req, res, next) => {
  try {
    const bookings = await TrainingBooking.find({ user: req.user._id })
      .populate('trainer', 'name specialization image')
      .sort({ date: -1 });
    res.status(200).json({ success: true, data: bookings });
  } catch (error) { next(error); }
};

// @desc   Cancel a booking
// @route  PUT /api/bookings/:id/cancel
// @access Private
const cancelBooking = async (req, res, next) => {
  try {
    const booking = await TrainingBooking.findById(req.params.id);
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found.' });
    if (booking.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized.' });
    }
    if (booking.status === 'cancelled') {
      return res.status(400).json({ success: false, message: 'Booking already cancelled.' });
    }
    booking.status = 'cancelled';
    booking.cancellationReason = req.body.reason || 'Cancelled by user';
    await booking.save();
    res.status(200).json({ success: true, message: 'Booking cancelled.', data: booking });
  } catch (error) { next(error); }
};

// @desc   Get all bookings (Admin)
// @route  GET /api/bookings
// @access Admin
const getAllBookings = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const filter = {};
    if (req.query.status) filter.status = req.query.status;

    const total = await TrainingBooking.countDocuments(filter);
    const bookings = await TrainingBooking.find(filter)
      .populate('user', 'name email')
      .populate('trainer', 'name specialization')
      .sort({ date: -1 })
      .skip((page - 1) * limit).limit(limit);

    res.status(200).json({
      success: true,
      data: bookings,
      pagination: { total, page, pages: Math.ceil(total / limit) }
    });
  } catch (error) { next(error); }
};

// @desc   Update booking status (Admin)
// @route  PUT /api/bookings/:id/status
// @access Admin
const updateBookingStatus = async (req, res, next) => {
  try {
    const booking = await TrainingBooking.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    ).populate('user', 'name email').populate('trainer', 'name');
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found.' });
    res.status(200).json({ success: true, message: 'Booking status updated.', data: booking });
  } catch (error) { next(error); }
};

module.exports = { createBooking, getMyBookings, cancelBooking, getAllBookings, updateBookingStatus };
