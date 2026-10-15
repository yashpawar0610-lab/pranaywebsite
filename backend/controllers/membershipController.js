const MembershipPlan = require('../models/MembershipPlan');
const Membership = require('../models/Membership');

// @desc   Get all active membership plans
// @route  GET /api/memberships/plans
// @access Public
const getPlans = async (req, res, next) => {
  try {
    const plans = await MembershipPlan.find({ isActive: true }).sort({ price: 1 });
    res.status(200).json({ success: true, data: plans });
  } catch (error) { next(error); }
};

// @desc   Subscribe to a membership plan
// @route  POST /api/memberships/subscribe
// @access Private
const subscribe = async (req, res, next) => {
  try {
    const { planId } = req.body;
    const plan = await MembershipPlan.findById(planId);
    if (!plan) {
      return res.status(404).json({ success: false, message: 'Membership plan not found.' });
    }

    // Cancel existing active membership
    await Membership.updateMany(
      { user: req.user._id, status: 'active' },
      { status: 'cancelled' }
    );

    const startDate = new Date();
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + plan.duration);

    const membership = await Membership.create({
      user: req.user._id,
      plan: planId,
      startDate,
      endDate,
      status: 'active',
      paymentStatus: 'demo',
      amountPaid: plan.price,
      notes: 'Demo subscription - no actual payment processed.'
    });

    const populated = await membership.populate('plan');
    res.status(201).json({
      success: true,
      message: `Successfully subscribed to ${plan.name} plan! (Demo mode - no real payment)`,
      data: populated
    });
  } catch (error) { next(error); }
};

// @desc   Get current user's membership
// @route  GET /api/memberships/my
// @access Private
const getMyMembership = async (req, res, next) => {
  try {
    const membership = await Membership.findOne({ user: req.user._id })
      .populate('plan').sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: membership });
  } catch (error) { next(error); }
};

// @desc   Get all memberships (Admin)
// @route  GET /api/memberships
// @access Admin
const getAllMemberships = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const filter = {};
    if (req.query.status) filter.status = req.query.status;

    const total = await Membership.countDocuments(filter);
    const memberships = await Membership.find(filter)
      .populate('user', 'name email phone')
      .populate('plan', 'name price duration')
      .sort({ createdAt: -1 })
      .skip(skip).limit(limit);

    res.status(200).json({
      success: true,
      data: memberships,
      pagination: { total, page, pages: Math.ceil(total / limit) }
    });
  } catch (error) { next(error); }
};

// @desc   Create/Update plan (Admin)
// @route  POST /api/memberships/plans
// @access Admin
const createPlan = async (req, res, next) => {
  try {
    const plan = await MembershipPlan.create(req.body);
    res.status(201).json({ success: true, message: 'Plan created.', data: plan });
  } catch (error) { next(error); }
};

// @desc   Update plan (Admin)
// @route  PUT /api/memberships/plans/:id
// @access Admin
const updatePlan = async (req, res, next) => {
  try {
    const plan = await MembershipPlan.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!plan) return res.status(404).json({ success: false, message: 'Plan not found.' });
    res.status(200).json({ success: true, message: 'Plan updated.', data: plan });
  } catch (error) { next(error); }
};

// @desc   Delete plan (Admin)
// @route  DELETE /api/memberships/plans/:id
// @access Admin
const deletePlan = async (req, res, next) => {
  try {
    const plan = await MembershipPlan.findByIdAndDelete(req.params.id);
    if (!plan) return res.status(404).json({ success: false, message: 'Plan not found.' });
    res.status(200).json({ success: true, message: 'Plan deleted.' });
  } catch (error) { next(error); }
};

module.exports = { getPlans, subscribe, getMyMembership, getAllMemberships, createPlan, updatePlan, deletePlan };
