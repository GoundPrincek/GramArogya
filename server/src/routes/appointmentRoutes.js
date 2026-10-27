const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');
const { validateBookAppointment, validateRejectReason } = require('../validators/appointmentValidator');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

// All appointment routes require authentication
router.use(protect);

router.post('/', validateBookAppointment, appointmentController.bookAppointment);
router.get('/', appointmentController.getAppointments);
router.get('/:id', appointmentController.getAppointmentById);

// Status transitions
router.patch('/:id/cancel', appointmentController.cancelAppointment);
router.patch('/:id/accept', authorize('staff', 'doctor', 'admin'), appointmentController.acceptAppointment);
router.patch('/:id/reject', authorize('staff', 'doctor', 'admin'), validateRejectReason, appointmentController.rejectAppointment);
router.patch('/:id/complete', authorize('staff', 'doctor', 'admin'), appointmentController.completeAppointment);

module.exports = router;
