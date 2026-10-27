const ApiError = require('../utils/ApiError');

/**
 * Validate facility registration and creation
 */
const validateCreateFacility = (req, res, next) => {
  const { name, facilityCode, tier, contact, address, location } = req.body;
  const errors = [];

  if (!name || name.trim().length === 0) {
    errors.push({ field: 'name', message: 'Facility name is required' });
  }

  if (!facilityCode || facilityCode.trim().length === 0) {
    errors.push({ field: 'facilityCode', message: 'Facility unique code is required' });
  }

  const validTiers = ['SubCenter', 'PHC', 'CHC', 'SubDistrictHospital', 'DistrictHospital'];
  if (!tier || !validTiers.includes(tier)) {
    errors.push({ field: 'tier', message: `Tier must be one of: ${validTiers.join(', ')}` });
  }

  if (!contact || !contact.phone) {
    errors.push({ field: 'contact.phone', message: 'Contact phone number is required' });
  }

  if (!address || !address.taluka || !address.district || !address.pincode) {
    errors.push({ field: 'address', message: 'Address requires district, taluka, and pincode' });
  }

  if (!location || !Array.isArray(location.coordinates) || location.coordinates.length !== 2) {
    errors.push({ field: 'location.coordinates', message: 'Coordinates must be [longitude, latitude]' });
  }

  if (errors.length > 0) {
    return next(new ApiError(400, 'Validation failed for facility creation', errors));
  }

  next();
};

/**
 * Validate nearby facilities query parameters
 */
const validateNearbyQuery = (req, res, next) => {
  const { lat, lng } = req.query;
  const errors = [];

  if (!lat || isNaN(parseFloat(lat))) {
    errors.push({ field: 'lat', message: 'Latitude (lat) query parameter is required and must be numeric' });
  }

  if (!lng || isNaN(parseFloat(lng))) {
    errors.push({ field: 'lng', message: 'Longitude (lng) query parameter is required and must be numeric' });
  }

  if (errors.length > 0) {
    return next(new ApiError(400, 'Invalid coordinates for nearby search', errors));
  }

  next();
};

module.exports = {
  validateCreateFacility,
  validateNearbyQuery
};
