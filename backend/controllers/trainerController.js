const Trainer = require('../models/Trainer');

// @desc   Get all trainers
// @route  GET /api/trainers
// @access Public
const getTrainers = async (req, res, next) => {
  try {
    const trainers = await Trainer.find({ isActive: true }).sort({ rating: -1 });
    res.status(200).json({ success: true, data: trainers });
  } catch (error) { next(error); }
};

// @desc   Get single trainer
// @route  GET /api/trainers/:id
// @access Public
const getTrainer = async (req, res, next) => {
  try {
    const trainer = await Trainer.findById(req.params.id);
    if (!trainer) return res.status(404).json({ success: false, message: 'Trainer not found.' });
    res.status(200).json({ success: true, data: trainer });
  } catch (error) { next(error); }
};

// @desc   Create trainer (Admin)
// @route  POST /api/trainers
// @access Admin
const createTrainer = async (req, res, next) => {
  try {
    const trainer = await Trainer.create(req.body);
    res.status(201).json({ success: true, message: 'Trainer created.', data: trainer });
  } catch (error) { next(error); }
};

// @desc   Update trainer (Admin)
// @route  PUT /api/trainers/:id
// @access Admin
const updateTrainer = async (req, res, next) => {
  try {
    const trainer = await Trainer.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!trainer) return res.status(404).json({ success: false, message: 'Trainer not found.' });
    res.status(200).json({ success: true, message: 'Trainer updated.', data: trainer });
  } catch (error) { next(error); }
};

// @desc   Delete trainer (Admin)
// @route  DELETE /api/trainers/:id
// @access Admin
const deleteTrainer = async (req, res, next) => {
  try {
    const trainer = await Trainer.findByIdAndDelete(req.params.id);
    if (!trainer) return res.status(404).json({ success: false, message: 'Trainer not found.' });
    res.status(200).json({ success: true, message: 'Trainer deleted.' });
  } catch (error) { next(error); }
};

module.exports = { getTrainers, getTrainer, createTrainer, updateTrainer, deleteTrainer };
