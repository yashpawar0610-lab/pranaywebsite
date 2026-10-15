const express = require('express');
const {
  getPlans, subscribe, getMyMembership,
  getAllMemberships, createPlan, updatePlan, deletePlan
} = require('../controllers/membershipController');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

router.get('/plans', getPlans);
router.post('/subscribe', protect, subscribe);
router.get('/my', protect, getMyMembership);
router.get('/', protect, adminOnly, getAllMemberships);
router.post('/plans', protect, adminOnly, createPlan);
router.put('/plans/:id', protect, adminOnly, updatePlan);
router.delete('/plans/:id', protect, adminOnly, deletePlan);

module.exports = router;
