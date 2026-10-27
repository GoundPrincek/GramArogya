const asyncHandler = require('../utils/asyncHandler');
const appointmentService = require('../services/appointmentService');

/**
 * @desc    Book a new appointment
 * @route   POST /api/appointments
 * @access  Private
 */
const bookAppointment = asyncHandler(async (req, res) => {
  const bookingData = {
    ...req.body,
    patientId: req.body.patientId || req.user.id,
    bookedBy: req.user.id
  };

  const appointment = await appointmentService.bookAppointment(bookingData);
  res.status(201).json({
    success: true,
    message: 'Appointment booked successfully',
    data: appointment
  });
});

/**
 * @desc    Get appointments for the logged-in patient
 * @route   GET /api/appointments/my
 * @access  Private (Patient)
 */
const getMyAppointments = asyncHandler(async (req, res) => {
  const appointments = await appointmentService.getMyAppointments(req.user.id);
  res.status(200).json({
    success: true,
    message: 'Appointments retrieved successfully',
    data: appointments
  });
});

/**
 * @desc    Get appointments for a specific facility
 * @route   GET /api/appointments/facility/:facilityId
 * @access  Private (Staff / Doctor / Admin)
 */
const getFacilityAppointments = asyncHandler(async (req, res) => {
  const appointments = await appointmentService.getFacilityAppointments(
    req.params.facilityId,
    req.query.date
  );
  res.status(200).json({
    success: true,
    message: 'Facility schedule retrieved successfully',
    data: appointments
  });
});

/**
 * @desc    Update appointment status
 * @route   PUT /api/appointments/:id/status
 * @access  Private (Staff / Doctor)
 */
const updateStatus = asyncHandler(async (req, res) => {
  const appointment = await appointmentService.updateAppointmentStatus(
    req.params.id,
    req.body.status,
    req.body.consultationNotes
  );
  res.status(200).json({
    success: true,
    message: 'Appointment status updated successfully',
    data: appointment
  });
});

module.exports = {
  bookAppointment,
  getMyAppointments,
  getFacilityAppointments,
  updateStatus
};
