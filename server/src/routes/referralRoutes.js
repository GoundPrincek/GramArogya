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
router.get('/my', referralController.getReferrals);
router.get('/facility/:facilityId', (req, res, next) => {
  req.query.facility = req.params.facilityId;
  return referralController.getReferrals(req, res, next);
});
router.get('/:id', referralController.getReferralById);

router.patch(
  '/:id/status',
  authorize('staff', 'doctor', 'admin'),
  validateUpdateStatus,
  referralController.updateStatus
);

router.put(
  '/:id/triage',
  authorize('staff', 'doctor', 'admin'),
  (req, res, next) => {
    req.body.note = req.body.actionNotes || req.body.note;
    return referralController.updateStatus(req, res, next);
  }
);

module.exports = router;
