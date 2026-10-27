const express = require('express');
const router = express.Router();
const facilityController = require('../controllers/facilityController');
const { validateCreateFacility, validateNearbyQuery } = require('../validators/facilityValidator');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.get('/', facilityController.getFacilities);
router.get('/nearby', validateNearbyQuery, facilityController.getNearbyFacilities);
router.get('/:id', facilityController.getFacilityById);

// Admin-restricted routes
router.post('/', protect, authorize('admin'), validateCreateFacility, facilityController.createFacility);
router.put('/:id', protect, authorize('admin'), validateCreateFacility, facilityController.updateFacility);
router.patch('/:id/status', protect, authorize('admin'), facilityController.updateStatus);

module.exports = router;
