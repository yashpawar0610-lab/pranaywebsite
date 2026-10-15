const User = require('../models/User');
const Membership = require('../models/Membership');
const WorkoutProgress = require('../models/WorkoutProgress');
const TrainingBooking = require('../models/TrainingBooking');

// @desc   Get user profile
// @route  GET /api/users/profile
// @access Private
const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    res.status(200).json({ success: true, user });
  } catch (error) { next(error); }
};

// @desc   Update user profile
// @route  PUT /api/users/profile
// @access Private
const updateProfile = async (req, res, next) => {
  try {
    const { name, phone, height, weight, fitnessGoal, profileImage } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, phone, height, weight, fitnessGoal, profileImage },
      { new: true, runValidators: true }
    );
    res.status(200).json({ success: true, message: 'Profile updated.', user });
  } catch (error) { next(error); }
};

// @desc   Change password
// @route  PUT /api/users/change-password
// @access Private
const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id).select('+password');
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Current password is incorrect.' });
    }
    user.password = newPassword;
    await user.save();
    res.status(200).json({ success: true, message: 'Password changed successfully.' });
  } catch (error) { next(error); }
};

// @desc   Get member dashboard data
// @route  GET /api/users/dashboard
// @access Private
const getDashboard = async (req, res, next) => {
  try {
    const membership = await Membership.findOne({ user: req.user._id, status: 'active' })
      .populate('plan').sort({ createdAt: -1 });
    const recentProgress = await WorkoutProgress.find({ user: req.user._id })
      .sort({ date: -1 }).limit(7).populate('program', 'title category');
    const upcomingBookings = await TrainingBooking.find({
      user: req.user._id,
      date: { $gte: new Date() },
      status: { $in: ['pending', 'confirmed'] }
    }).populate('trainer', 'name specialization image').sort({ date: 1 }).limit(5);

    res.status(200).json({
      success: true,
      data: {
        user: req.user,
        membership,
        recentProgress,
        upcomingBookings
      }
    });
  } catch (error) { next(error); }
};

module.exports = { getProfile, updateProfile, changePassword, getDashboard };
