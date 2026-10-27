const asyncHandler = require('../utils/asyncHandler');
const facilityService = require('../services/facilityService');

/**
 * @desc    Get all facilities with filters
 * @route   GET /api/facilities
 * @access  Public
 */
const getFacilities = asyncHandler(async (req, res) => {
  const facilities = await facilityService.getFacilities(req.query);
  res.status(200).json({
    success: true,
    message: 'Facilities retrieved successfully',
    data: facilities
  });
});

/**
 * @desc    Find facilities near given latitude/longitude
 * @route   GET /api/facilities/nearby
 * @access  Public
 */
const getNearbyFacilities = asyncHandler(async (req, res) => {
  const { lat, lng, radiusKm } = req.query;
  const facilities = await facilityService.getNearbyFacilities(
    parseFloat(lng),
    parseFloat(lat),
    radiusKm ? parseFloat(radiusKm) : 25
  );

  res.status(200).json({
    success: true,
    message: 'Nearby facilities retrieved successfully',
    data: facilities
  });
});

/**
 * @desc    Get facility details by ID
 * @route   GET /api/facilities/:id
 * @access  Public
 */
const getFacilityById = asyncHandler(async (req, res) => {
  const facility = await facilityService.getFacilityById(req.params.id);
  res.status(200).json({
    success: true,
    message: 'Facility details retrieved successfully',
    data: facility
  });
});

/**
 * @desc    Register a new healthcare facility
 * @route   POST /api/facilities
 * @access  Private (Admin)
 */
const createFacility = asyncHandler(async (req, res) => {
  const facility = await facilityService.createFacility(req.body);
  res.status(201).json({
    success: true,
    message: 'Healthcare facility registered successfully',
    data: facility
  });
});

module.exports = {
  getFacilities,
  getNearbyFacilities,
  getFacilityById,
  createFacility
};
