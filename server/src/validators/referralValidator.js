const { z } = require('zod');
const ApiError = require('../utils/ApiError');

const createReferralSchema = z.object({
  patient: z.string().min(1, 'Patient ID is required'),
  referringFacility: z.string().min(1, 'Referring facility ID is required'),
  receivingFacility: z.string().min(1, 'Receiving facility ID is required'),
  referralReason: z.string().trim().min(5, 'Clinical referral reason is required (min 5 characters)'),
  provisionalDiagnosis: z.string().trim().optional(),
  urgencyLevel: z.enum(['Normal', 'Routine', 'Urgent', 'Emergency']).optional(),
  vitals: z.object({
    bloodPressure: z.string().optional(),
    pulse: z.number().optional(),
    spo2: z.string().optional(),
    temp: z.string().optional()
  }).optional()
});

const validateCreateReferral = (req, res, next) => {
  try {
    // Map patientId -> patient
    if (!req.body.patient && req.body.patientId) {
      req.body.patient = req.body.patientId;
    }
    // Map fromFacilityId -> referringFacility
    if (!req.body.referringFacility && req.body.fromFacilityId) {
      req.body.referringFacility = req.body.fromFacilityId;
    }
    // Map toFacilityId -> receivingFacility
    if (!req.body.receivingFacility && req.body.toFacilityId) {
      req.body.receivingFacility = req.body.toFacilityId;
    }
    // Map reasonForReferral -> referralReason
    if (!req.body.referralReason && req.body.reasonForReferral) {
      req.body.referralReason = req.body.reasonForReferral;
    }

    const parsed = createReferralSchema.parse(req.body);
    req.body = parsed;
    next();
  } catch (err) {
    const list = err.issues || err.errors || [];
    const errors = list.map((e) => ({
      field: Array.isArray(e.path) ? e.path.join('.') : '',
      message: e.message
    }));
    next(new ApiError(400, 'Validation failed for clinical referral', errors));
  }
};

const updateStatusSchema = z.object({
  status: z.enum(['created', 'sent', 'accepted', 'in_progress', 'completed', 'rejected'], {
    errorMap: () => ({ message: 'Status must be one of: created, sent, accepted, in_progress, completed, rejected' })
  }),
  note: z.string().trim().optional()
});

const validateUpdateStatus = (req, res, next) => {
  try {
    // Normalize status to lowercase
    if (req.body.status) {
      req.body.status = req.body.status.toLowerCase().replace(' ', '_');
    }
    const parsed = updateStatusSchema.parse(req.body);
    req.body = parsed;
    next();
  } catch (err) {
    const list = err.issues || err.errors || [];
    const errors = list.map((e) => ({
      field: Array.isArray(e.path) ? e.path.join('.') : '',
      message: e.message
    }));
    next(new ApiError(400, 'Validation failed for referral status update', errors));
  }
};

module.exports = {
  validateCreateReferral,
  validateUpdateStatus,
  createReferralSchema
};
