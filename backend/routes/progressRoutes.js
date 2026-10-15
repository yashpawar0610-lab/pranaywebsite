const express = require('express');
const { logProgress, getMyProgress, deleteProgress } = require('../controllers/progressController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/', protect, logProgress);
router.get('/my', protect, getMyProgress);
router.delete('/:id', protect, deleteProgress);

module.exports = router;
