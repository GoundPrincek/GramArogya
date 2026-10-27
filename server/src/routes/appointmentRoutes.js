const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');
const { validateBookAppointment, validateUpdateStatus } = require('../validators/appointmentValidator');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.post('/', protect, validateBookAppointment, appointmentController.bookAppointment);
router.get('/my', protect, appointmentController.getMyAppointments);
router.get('/facility/:facilityId', protect, authorize('doctor', 'staff', 'admin'), appointmentController.getFacilityAppointments);
router.put('/:id/status', protect, authorize('doctor', 'staff', 'admin'), validateUpdateStatus, appointmentController.updateStatus);

module.exports = router;
