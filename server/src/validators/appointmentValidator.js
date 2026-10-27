const { z } = require('zod');
const ApiError = require('../utils/ApiError');

const bookAppointmentSchema = z.object({
  facility: z.string().min(1, 'Facility ID is required'),
  requestedService: z.string().trim().min(2, 'Requested service is required'),
  preferredDate: z.string().min(1, 'Preferred appointment date is required'),
  preferredTime: z.string().trim().min(1, 'Preferred time slot is required'),
  notes: z.string().trim().optional()
});

const validateBookAppointment = (req, res, next) => {
  try {
    // Map facilityId -> facility if passed
    if (!req.body.facility && req.body.facilityId) {
      req.body.facility = req.body.facilityId;
    }
    // Map service -> requestedService if passed
    if (!req.body.requestedService && req.body.service) {
      req.body.requestedService = req.body.service;
    }
    // Map appointmentDate -> preferredDate if passed
    if (!req.body.preferredDate && req.body.appointmentDate) {
      req.body.preferredDate = req.body.appointmentDate;
    }
    // Map timeSlot -> preferredTime if passed
    if (!req.body.preferredTime && req.body.timeSlot) {
      req.body.preferredTime = req.body.timeSlot;
    }
    // Map symptoms -> notes if passed
    if (!req.body.notes && req.body.symptoms) {
      req.body.notes = req.body.symptoms;
    }

    const parsed = bookAppointmentSchema.parse(req.body);
    req.body = parsed;
    next();
  } catch (err) {
    const errors = err.errors.map((e) => ({
      field: e.path.join('.'),
      message: e.message
    }));
    next(new ApiError(400, 'Validation failed for appointment booking', errors));
  }
};

const rejectReasonSchema = z.object({
  decisionReason: z.string().trim().min(3, 'A clear reason for rejecting the appointment is required')
});

const validateRejectReason = (req, res, next) => {
  try {
    // Map reason -> decisionReason if passed
    if (!req.body.decisionReason && req.body.reason) {
      req.body.decisionReason = req.body.reason;
    }
    const parsed = rejectReasonSchema.parse(req.body);
    req.body = parsed;
    next();
  } catch (err) {
    const errors = err.errors.map((e) => ({
      field: e.path.join('.'),
      message: e.message
    }));
    next(new ApiError(400, 'Rejection reason is required', errors));
  }
};

module.exports = {
  validateBookAppointment,
  validateRejectReason,
  bookAppointmentSchema
};
