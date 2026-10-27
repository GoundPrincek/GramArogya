const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.use(protect);

router.get('/patient', authorize('patient', 'admin'), dashboardController.getPatientDashboard);
router.get('/staff', authorize('staff', 'doctor', 'asha_worker', 'admin'), dashboardController.getStaffDashboard);
router.get('/admin', authorize('admin'), dashboardController.getAdminDashboard);

module.exports = router;
