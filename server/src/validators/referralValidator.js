const ApiError = require('../utils/ApiError');

/**
 * Validate clinical referral creation
 */
const validateCreateReferral = (req, res, next) => {
  const { patientId, fromFacilityId, toFacilityId, reasonForReferral, provisionalDiagnosis } = req.body;
  const errors = [];

  if (!patientId) {
    errors.push({ field: 'patientId', message: 'Patient ID is required' });
  }

  if (!fromFacilityId) {
    errors.push({ field: 'fromFacilityId', message: 'Originating facility ID is required' });
  }

  if (!toFacilityId) {
    errors.push({ field: 'toFacilityId', message: 'Target referral facility ID is required' });
  }

  if (!reasonForReferral || reasonForReferral.trim().length === 0) {
    errors.push({ field: 'reasonForReferral', message: 'Reason for clinical referral is required' });
  }

  if (!provisionalDiagnosis || provisionalDiagnosis.trim().length === 0) {
    errors.push({ field: 'provisionalDiagnosis', message: 'Provisional clinical diagnosis is required' });
  }

  if (errors.length > 0) {
    return next(new ApiError(400, 'Validation failed for clinical referral', errors));
  }

  next();
};

/**
 * Validate referral triage update
 */
const validateTriageReferral = (req, res, next) => {
  const { status } = req.body;
  const validStatuses = ['Accepted', 'EnRoute', 'Arrived', 'Completed', 'Rejected'];

  if (!status || !validStatuses.includes(status)) {
    return next(
      new ApiError(400, `Invalid triage status. Must be one of: ${validStatuses.join(', ')}`)
    );
  }

  next();
};

module.exports = {
  validateCreateReferral,
  validateTriageReferral
};
