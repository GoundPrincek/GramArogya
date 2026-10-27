const asyncHandler = require('../utils/asyncHandler');
const referralService = require('../services/referralService');

/**
 * @desc    Create an inter-facility clinical referral
 * @route   POST /api/referrals
 * @access  Private (Doctor / Staff)
 */
const createReferral = asyncHandler(async (req, res) => {
  const referralData = {
    ...req.body,
    referringDoctorId: req.user.id
  };

  const referral = await referralService.createReferral(referralData);
  res.status(201).json({
    success: true,
    message: 'Clinical referral created successfully',
    data: referral
  });
});

/**
 * @desc    Get referrals for the logged-in patient
 * @route   GET /api/referrals/my
 * @access  Private (Patient)
 */
const getMyReferrals = asyncHandler(async (req, res) => {
  const referrals = await referralService.getMyReferrals(req.user.id);
  res.status(200).json({
    success: true,
    message: 'Patient referrals retrieved successfully',
    data: referrals
  });
});

/**
 * @desc    Get facility incoming/outgoing referrals
 * @route   GET /api/referrals/facility/:facilityId
 * @access  Private (Doctor / Staff)
 */
const getFacilityReferrals = asyncHandler(async (req, res) => {
  const direction = req.query.direction || 'incoming';
  const referrals = await referralService.getFacilityReferrals(req.params.facilityId, direction);
  res.status(200).json({
    success: true,
    message: `${direction} referrals retrieved successfully`,
    data: referrals
  });
});

/**
 * @desc    Triage or update referral status
 * @route   PUT /api/referrals/:id/triage
 * @access  Private (Doctor)
 */
const triageReferral = asyncHandler(async (req, res) => {
  const referral = await referralService.triageReferral(
    req.params.id,
    req.body.status,
    req.user.id,
    req.body.actionNotes
  );
  res.status(200).json({
    success: true,
    message: 'Referral triaged successfully',
    data: referral
  });
});

module.exports = {
  createReferral,
  getMyReferrals,
  getFacilityReferrals,
  triageReferral
};
