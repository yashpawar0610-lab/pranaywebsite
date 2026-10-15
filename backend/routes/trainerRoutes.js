const express = require('express');
const { getTrainers, getTrainer, createTrainer, updateTrainer, deleteTrainer } = require('../controllers/trainerController');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

router.get('/', getTrainers);
router.get('/:id', getTrainer);
router.post('/', protect, adminOnly, createTrainer);
router.put('/:id', protect, adminOnly, updateTrainer);
router.delete('/:id', protect, adminOnly, deleteTrainer);

module.exports = router;
