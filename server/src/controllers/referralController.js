const asyncHandler = require('../utils/asyncHandler');
const referralService = require('../services/referralService');

/**
 * @desc    Create a new clinical referral
 * @route   POST /api/referrals
 * @access  Private (Staff / Doctor / Admin)
 */
const createReferral = asyncHandler(async (req, res) => {
  const referral = await referralService.createReferral(req.body, req.user);
  res.status(201).json({
    success: true,
    message: 'Clinical referral created successfully',
    data: referral
  });
});

/**
 * @desc    Get referrals accessible to user
 * @route   GET /api/referrals
 * @access  Private
 */
const getReferrals = asyncHandler(async (req, res) => {
  const referrals = await referralService.getReferrals(req.user, req.query);
  res.status(200).json({
    success: true,
    count: referrals.length,
    message: 'Referrals retrieved successfully',
    data: referrals
  });
});

/**
 * @desc    Get single referral details
 * @route   GET /api/referrals/:id
 * @access  Private
 */
const getReferralById = asyncHandler(async (req, res) => {
  const referral = await referralService.getReferralById(req.params.id, req.user);
  res.status(200).json({
    success: true,
    message: 'Referral details retrieved successfully',
    data: referral
  });
});

/**
 * @desc    Update referral status and timeline
 * @route   PATCH /api/referrals/:id/status
 * @access  Private (Staff / Doctor / Admin)
 */
const updateStatus = asyncHandler(async (req, res) => {
  const referral = await referralService.updateReferralStatus(
    req.params.id,
    req.body.status,
    req.body.note,
    req.user
  );
  res.status(200).json({
    success: true,
    message: `Referral status updated to '${referral.status}'`,
    data: referral
  });
});

module.exports = {
  createReferral,
  getReferrals,
  getReferralById,
  updateStatus
};
