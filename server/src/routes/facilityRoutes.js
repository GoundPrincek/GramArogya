const express = require('express');
const router = express.Router();
const facilityController = require('../controllers/facilityController');
const { validateCreateFacility, validateNearbyQuery } = require('../validators/facilityValidator');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.get('/', facilityController.getFacilities);
router.get('/nearby', validateNearbyQuery, facilityController.getNearbyFacilities);
router.get('/:id', facilityController.getFacilityById);
router.post('/', protect, authorize('admin'), validateCreateFacility, facilityController.createFacility);

module.exports = router;
