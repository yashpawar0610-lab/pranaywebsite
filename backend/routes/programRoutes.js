const express = require('express');
const {
  getPrograms, getProgram, enrollProgram, getEnrolled,
  createProgram, updateProgram, deleteProgram
} = require('../controllers/programController');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

router.get('/', getPrograms);
router.get('/enrolled', protect, getEnrolled);
router.get('/:id', getProgram);
router.post('/:id/enroll', protect, enrollProgram);
router.post('/', protect, adminOnly, createProgram);
router.put('/:id', protect, adminOnly, updateProgram);
router.delete('/:id', protect, adminOnly, deleteProgram);

module.exports = router;
