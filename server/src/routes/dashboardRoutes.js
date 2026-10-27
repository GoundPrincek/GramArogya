const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.get('/stats', protect, authorize('doctor', 'staff', 'admin'), dashboardController.getStats);
router.get('/overview', protect, dashboardController.getOverview);

module.exports = router;
