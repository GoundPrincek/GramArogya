const asyncHandler = require('../utils/asyncHandler');
const facilityService = require('../services/facilityService');

/**
 * @desc    Get all facilities with filters, search, and pagination
 * @route   GET /api/facilities
 * @access  Public
 */
const getFacilities = asyncHandler(async (req, res) => {
  const result = await facilityService.getFacilities(req.query);
  res.status(200).json({
    success: true,
    message: 'Facilities retrieved successfully',
    total: result.total,
    page: result.page,
    totalPages: result.totalPages,
    limit: result.limit,
    pagination: {
      total: result.total,
      page: result.page,
      totalPages: result.totalPages,
      limit: result.limit
    },
    data: result.facilities
  });
});

/**
 * @desc    Get nearby facilities by coordinates
 * @route   GET /api/facilities/nearby
 * @access  Public
 */
const getNearbyFacilities = asyncHandler(async (req, res) => {
  const { lat, lng, radiusKm } = req.query;
  const facilities = await facilityService.getNearbyFacilities(
    parseFloat(lng),
    parseFloat(lat),
    radiusKm ? parseFloat(radiusKm) : 30
  );

  res.status(200).json({
    success: true,
    message: 'Nearby facilities retrieved successfully',
    data: facilities
  });
});

/**
 * @desc    Get single facility details
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
 * @desc    Create new facility
 * @route   POST /api/facilities
 * @access  Private (Admin)
 */
const createFacility = asyncHandler(async (req, res) => {
  const facility = await facilityService.createFacility(req.body, req.user?.id);
  res.status(201).json({
    success: true,
    message: 'Healthcare facility registered successfully',
    data: facility
  });
});

/**
 * @desc    Update existing facility
 * @route   PUT /api/facilities/:id
 * @access  Private (Admin)
 */
const updateFacility = asyncHandler(async (req, res) => {
  const facility = await facilityService.updateFacility(req.params.id, req.body, req.user?.id);
  res.status(200).json({
    success: true,
    message: 'Facility updated successfully',
    data: facility
  });
});

/**
 * @desc    Toggle facility active status
 * @route   PATCH /api/facilities/:id/status
 * @access  Private (Admin)
 */
const updateStatus = asyncHandler(async (req, res) => {
  const facility = await facilityService.updateFacilityStatus(
    req.params.id,
    req.body.isActive,
    req.user?.id
  );
  res.status(200).json({
    success: true,
    message: `Facility ${facility.isActive ? 'activated' : 'deactivated'} successfully`,
    data: facility
  });
});

module.exports = {
  getFacilities,
  getNearbyFacilities,
  getFacilityById,
  createFacility,
  updateFacility,
  updateStatus
};
