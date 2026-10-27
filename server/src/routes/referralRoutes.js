const express = require('express');
const router = express.Router();
const referralController = require('../controllers/referralController');
const { validateCreateReferral, validateTriageReferral } = require('../validators/referralValidator');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.post('/', protect, authorize('doctor', 'staff', 'asha_worker'), validateCreateReferral, referralController.createReferral);
router.get('/my', protect, referralController.getMyReferrals);
router.get('/facility/:facilityId', protect, authorize('doctor', 'staff', 'admin'), referralController.getFacilityReferrals);
router.put('/:id/triage', protect, authorize('doctor'), validateTriageReferral, referralController.triageReferral);

module.exports = router;
