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
router.get('/my', appointmentController.getAppointments);
router.get('/facility/:facilityId', (req, res, next) => {
  req.query.facility = req.params.facilityId;
  return appointmentController.getAppointments(req, res, next);
});
router.get('/:id', appointmentController.getAppointmentById);

// Status transitions
router.patch('/:id/cancel', appointmentController.cancelAppointment);
router.patch('/:id/accept', authorize('staff', 'doctor', 'admin'), appointmentController.acceptAppointment);
router.patch('/:id/reject', authorize('staff', 'doctor', 'admin'), validateRejectReason, appointmentController.rejectAppointment);
router.patch('/:id/complete', authorize('staff', 'doctor', 'admin'), appointmentController.completeAppointment);

// Unified status update handler for frontend flexibility
router.put('/:id/status', async (req, res, next) => {
  const { status, consultationNotes, reason, decisionReason } = req.body;
  const normalized = (status || '').toLowerCase();
  if (normalized === 'accepted') {
    return appointmentController.acceptAppointment(req, res, next);
  }
  if (normalized === 'rejected') {
    req.body.decisionReason = decisionReason || reason || 'Slot unavailable';
    return appointmentController.rejectAppointment(req, res, next);
  }
  if (normalized === 'cancelled') {
    req.body.reason = reason || 'Cancelled by user';
    return appointmentController.cancelAppointment(req, res, next);
  }
  if (normalized === 'completed') {
    req.body.consultationNotes = consultationNotes || '';
    return appointmentController.completeAppointment(req, res, next);
  }
  return res.status(400).json({ success: false, message: `Unsupported status update: ${status}` });
});

module.exports = router;
