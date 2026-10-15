const WorkoutProgress = require('../models/WorkoutProgress');

// @desc   Log workout progress
// @route  POST /api/progress
// @access Private
const logProgress = async (req, res, next) => {
  try {
    const { program, duration, caloriesBurned, exercisesCompleted, notes, weight, mood } = req.body;
    const progress = await WorkoutProgress.create({
      user: req.user._id,
      program: program || null,
      duration,
      caloriesBurned,
      exercisesCompleted: exercisesCompleted || [],
      notes: notes || '',
      weight: weight || null,
      mood: mood || ''
    });
    res.status(201).json({ success: true, message: 'Progress logged!', data: progress });
  } catch (error) { next(error); }
};

// @desc   Get my progress history
// @route  GET /api/progress/my
// @access Private
const getMyProgress = async (req, res, next) => {
  try {
    const { limit = 30 } = req.query;
    const progress = await WorkoutProgress.find({ user: req.user._id })
      .populate('program', 'title category')
      .sort({ date: -1 })
      .limit(parseInt(limit));
    res.status(200).json({ success: true, data: progress });
  } catch (error) { next(error); }
};

// @desc   Delete a progress entry
// @route  DELETE /api/progress/:id
// @access Private
const deleteProgress = async (req, res, next) => {
  try {
    const progress = await WorkoutProgress.findById(req.params.id);
    if (!progress) return res.status(404).json({ success: false, message: 'Progress entry not found.' });
    if (progress.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized.' });
    }
    await progress.deleteOne();
    res.status(200).json({ success: true, message: 'Progress entry deleted.' });
  } catch (error) { next(error); }
};

module.exports = { logProgress, getMyProgress, deleteProgress };
