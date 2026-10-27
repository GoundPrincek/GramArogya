const express = require('express');
const router = express.Router();
const referralController = require('../controllers/referralController');
const { validateCreateReferral, validateUpdateStatus } = require('../validators/referralValidator');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

// All referral endpoints require authentication
router.use(protect);

router.post(
  '/',
  authorize('staff', 'doctor', 'asha_worker', 'admin'),
  validateCreateReferral,
  referralController.createReferral
);

router.get('/', referralController.getReferrals);
router.get('/:id', referralController.getReferralById);

router.patch(
  '/:id/status',
  authorize('staff', 'doctor', 'admin'),
  validateUpdateStatus,
  referralController.updateStatus
);

module.exports = router;
