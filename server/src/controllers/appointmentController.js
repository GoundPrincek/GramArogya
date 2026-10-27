const asyncHandler = require('../utils/asyncHandler');
const appointmentService = require('../services/appointmentService');

/**
 * @desc    Submit an outpatient appointment request
 * @route   POST /api/appointments
 * @access  Private (Patient / Staff / Admin)
 */
const bookAppointment = asyncHandler(async (req, res) => {
  const appointment = await appointmentService.bookAppointment(req.body, req.user);
  res.status(201).json({
    success: true,
    message: 'Appointment request submitted successfully',
    data: appointment
  });
});

/**
 * @desc    Get appointments within user's permitted scope
 * @route   GET /api/appointments
 * @access  Private
 */
const getAppointments = asyncHandler(async (req, res) => {
  const appointments = await appointmentService.getAppointments(req.user, req.query);
  res.status(200).json({
    success: true,
    count: appointments.length,
    message: 'Appointments retrieved successfully',
    data: appointments
  });
});

/**
 * @desc    Get single appointment details
 * @route   GET /api/appointments/:id
 * @access  Private
 */
const getAppointmentById = asyncHandler(async (req, res) => {
  const appointment = await appointmentService.getAppointmentById(req.params.id, req.user);
  res.status(200).json({
    success: true,
    message: 'Appointment details retrieved successfully',
    data: appointment
  });
});

/**
 * @desc    Cancel an appointment request
 * @route   PATCH /api/appointments/:id/cancel
 * @access  Private (Patient self / Staff / Admin)
 */
const cancelAppointment = asyncHandler(async (req, res) => {
  const appointment = await appointmentService.cancelAppointment(
    req.params.id,
    req.body.reason,
    req.user
  );
  res.status(200).json({
    success: true,
    message: 'Appointment request cancelled successfully',
    data: appointment
  });
});

/**
 * @desc    Accept an appointment request
 * @route   PATCH /api/appointments/:id/accept
 * @access  Private (Staff / Admin)
 */
const acceptAppointment = asyncHandler(async (req, res) => {
  const appointment = await appointmentService.acceptAppointment(req.params.id, req.user);
  res.status(200).json({
    success: true,
    message: 'Appointment request accepted successfully',
    data: appointment
  });
});

/**
 * @desc    Reject an appointment request
 * @route   PATCH /api/appointments/:id/reject
 * @access  Private (Staff / Admin)
 */
const rejectAppointment = asyncHandler(async (req, res) => {
  const appointment = await appointmentService.rejectAppointment(
    req.params.id,
    req.body.decisionReason,
    req.user
  );
  res.status(200).json({
    success: true,
    message: 'Appointment request rejected',
    data: appointment
  });
});

/**
 * @desc    Mark appointment completed
 * @route   PATCH /api/appointments/:id/complete
 * @access  Private (Staff / Admin)
 */
const completeAppointment = asyncHandler(async (req, res) => {
  const appointment = await appointmentService.completeAppointment(
    req.params.id,
    req.body.consultationNotes,
    req.user
  );
  res.status(200).json({
    success: true,
    message: 'Appointment consultation marked as completed',
    data: appointment
  });
});

module.exports = {
  bookAppointment,
  getAppointments,
  getAppointmentById,
  cancelAppointment,
  acceptAppointment,
  rejectAppointment,
  completeAppointment
};
