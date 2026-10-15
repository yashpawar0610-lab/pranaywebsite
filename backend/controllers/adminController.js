const User = require('../models/User');
const Membership = require('../models/Membership');
const WorkoutProgram = require('../models/WorkoutProgram');
const Trainer = require('../models/Trainer');
const TrainingBooking = require('../models/TrainingBooking');
const ContactMessage = require('../models/ContactMessage');

// @desc   Get admin dashboard stats
// @route  GET /api/admin/stats
// @access Admin
const getStats = async (req, res, next) => {
  try {
    const [
      totalUsers, totalTrainers, totalPrograms,
      activeMemberships, expiredMemberships, pendingMemberships,
      totalBookings, pendingBookings, unreadMessages
    ] = await Promise.all([
      User.countDocuments({ role: 'member' }),
      Trainer.countDocuments({ isActive: true }),
      WorkoutProgram.countDocuments({ isActive: true }),
      Membership.countDocuments({ status: 'active' }),
      Membership.countDocuments({ status: 'expired' }),
      Membership.countDocuments({ status: 'pending' }),
      TrainingBooking.countDocuments(),
      TrainingBooking.countDocuments({ status: 'pending' }),
      ContactMessage.countDocuments({ isRead: false })
    ]);

    // Monthly revenue (demo - sum of active memberships)
    const revenueData = await Membership.aggregate([
      { $match: { status: 'active' } },
      { $group: { _id: null, total: { $sum: '$amountPaid' } } }
    ]);
    const totalRevenue = revenueData[0]?.total || 0;

    // Recent members
    const recentMembers = await User.find({ role: 'member' })
      .sort({ createdAt: -1 }).limit(5).select('name email createdAt');

    res.status(200).json({
      success: true,
      data: {
        totalUsers, totalTrainers, totalPrograms,
        activeMemberships, expiredMemberships, pendingMemberships,
        totalBookings, pendingBookings, unreadMessages,
        totalRevenue, recentMembers
      }
    });
  } catch (error) { next(error); }
};

// @desc   Get all users (Admin)
// @route  GET /api/admin/users
// @access Admin
const getAllUsers = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';
    const filter = { role: 'member' };
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const total = await User.countDocuments(filter);
    const users = await User.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit).limit(limit);

    res.status(200).json({
      success: true,
      data: users,
      pagination: { total, page, pages: Math.ceil(total / limit) }
    });
  } catch (error) { next(error); }
};

// @desc   Update user status/role (Admin)
// @route  PUT /api/admin/users/:id
// @access Admin
const updateUser = async (req, res, next) => {
  try {
    const { isActive, role } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id, { isActive, role }, { new: true }
    );
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });
    res.status(200).json({ success: true, message: 'User updated.', data: user });
  } catch (error) { next(error); }
};

// @desc   Delete user (Admin)
// @route  DELETE /api/admin/users/:id
// @access Admin
const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });
    res.status(200).json({ success: true, message: 'User deleted.' });
  } catch (error) { next(error); }
};

module.exports = { getStats, getAllUsers, updateUser, deleteUser };
