const ApiError = require('../utils/ApiError');

/**
 * Validate appointment booking payload
 */
const validateBookAppointment = (req, res, next) => {
  const { facilityId, appointmentDate, timeSlot } = req.body;
  const errors = [];

  if (!facilityId) {
    errors.push({ field: 'facilityId', message: 'Healthcare facility ID is required' });
  }

  if (!appointmentDate || isNaN(Date.parse(appointmentDate))) {
    errors.push({ field: 'appointmentDate', message: 'Valid appointment date is required' });
  }

  if (!timeSlot || timeSlot.trim().length === 0) {
    errors.push({ field: 'timeSlot', message: 'Time slot selection is required' });
  }

  if (errors.length > 0) {
    return next(new ApiError(400, 'Validation failed for appointment booking', errors));
  }

  next();
};

/**
 * Validate appointment status update
 */
const validateUpdateStatus = (req, res, next) => {
  const { status } = req.body;
  const validStatuses = ['Scheduled', 'Confirmed', 'Completed', 'Cancelled', 'NoShow'];

  if (!status || !validStatuses.includes(status)) {
    return next(
      new ApiError(400, `Invalid status. Must be one of: ${validStatuses.join(', ')}`)
    );
  }

  next();
};

module.exports = {
  validateBookAppointment,
  validateUpdateStatus
};
