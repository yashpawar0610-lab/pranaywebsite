const WorkoutProgram = require('../models/WorkoutProgram');

// @desc   Get all workout programs
// @route  GET /api/programs
// @access Public
const getPrograms = async (req, res, next) => {
  try {
    const { category, difficulty, search, page = 1, limit = 20 } = req.query;
    const filter = { isActive: true };
    if (category) filter.category = category;
    if (difficulty) filter.difficulty = difficulty;
    if (search) filter.title = { $regex: search, $options: 'i' };

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await WorkoutProgram.countDocuments(filter);
    const programs = await WorkoutProgram.find(filter)
      .select('-enrolledUsers')
      .sort({ createdAt: -1 })
      .skip(skip).limit(parseInt(limit));

    res.status(200).json({
      success: true,
      data: programs,
      pagination: { total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) }
    });
  } catch (error) { next(error); }
};

// @desc   Get single program
// @route  GET /api/programs/:id
// @access Public
const getProgram = async (req, res, next) => {
  try {
    const program = await WorkoutProgram.findById(req.params.id);
    if (!program) return res.status(404).json({ success: false, message: 'Program not found.' });
    res.status(200).json({ success: true, data: program });
  } catch (error) { next(error); }
};

// @desc   Enroll in a program
// @route  POST /api/programs/:id/enroll
// @access Private
const enrollProgram = async (req, res, next) => {
  try {
    const program = await WorkoutProgram.findById(req.params.id);
    if (!program) return res.status(404).json({ success: false, message: 'Program not found.' });

    if (program.enrolledUsers.includes(req.user._id)) {
      // Unenroll
      program.enrolledUsers = program.enrolledUsers.filter(id => id.toString() !== req.user._id.toString());
      await program.save();
      return res.status(200).json({ success: true, message: 'Unenrolled from program.', enrolled: false });
    }

    program.enrolledUsers.push(req.user._id);
    await program.save();
    res.status(200).json({ success: true, message: 'Enrolled in program!', enrolled: true });
  } catch (error) { next(error); }
};

// @desc   Get user's enrolled programs
// @route  GET /api/programs/enrolled
// @access Private
const getEnrolled = async (req, res, next) => {
  try {
    const programs = await WorkoutProgram.find({ enrolledUsers: req.user._id, isActive: true })
      .select('-enrolledUsers');
    res.status(200).json({ success: true, data: programs });
  } catch (error) { next(error); }
};

// @desc   Create program (Admin)
// @route  POST /api/programs
// @access Admin
const createProgram = async (req, res, next) => {
  try {
    const program = await WorkoutProgram.create(req.body);
    res.status(201).json({ success: true, message: 'Program created.', data: program });
  } catch (error) { next(error); }
};

// @desc   Update program (Admin)
// @route  PUT /api/programs/:id
// @access Admin
const updateProgram = async (req, res, next) => {
  try {
    const program = await WorkoutProgram.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!program) return res.status(404).json({ success: false, message: 'Program not found.' });
    res.status(200).json({ success: true, message: 'Program updated.', data: program });
  } catch (error) { next(error); }
};

// @desc   Delete program (Admin)
// @route  DELETE /api/programs/:id
// @access Admin
const deleteProgram = async (req, res, next) => {
  try {
    const program = await WorkoutProgram.findByIdAndDelete(req.params.id);
    if (!program) return res.status(404).json({ success: false, message: 'Program not found.' });
    res.status(200).json({ success: true, message: 'Program deleted.' });
  } catch (error) { next(error); }
};

module.exports = { getPrograms, getProgram, enrollProgram, getEnrolled, createProgram, updateProgram, deleteProgram };
