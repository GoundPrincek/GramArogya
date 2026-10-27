const { z } = require('zod');
const ApiError = require('../utils/ApiError');

const createFacilitySchema = z.object({
  name: z.string().trim().min(3, 'Facility name must be at least 3 characters'),
  facilityCode: z.string().trim().optional(),
  facilityType: z.enum(['SubCenter', 'PHC', 'CHC', 'SubDistrictHospital', 'DistrictHospital'], {
    errorMap: () => ({ message: 'Facility type must be SubCenter, PHC, CHC, SubDistrictHospital, or DistrictHospital' })
  }),
  address: z.string().trim().optional(),
  village: z.string().trim().optional(),
  taluka: z.string().trim().optional(),
  district: z.string().trim().min(2, 'District is required'),
  state: z.string().default('Maharashtra'),
  pincode: z.string().trim().optional(),
  coordinates: z.array(z.number()).length(2, 'Coordinates must be [longitude, latitude]').optional(),
  services: z.array(z.string()).optional(),
  contactInformation: z.object({
    phone: z.string().optional(),
    emergencyPhone: z.string().optional(),
    email: z.string().email().optional().or(z.literal(''))
  }).optional(),
  operatingHours: z.object({
    opensAt: z.string().optional(),
    closesAt: z.string().optional(),
    is24x7Emergency: z.boolean().optional()
  }).optional()
});

const validateCreateFacility = (req, res, next) => {
  try {
    // Map tier -> facilityType if client sends tier
    if (!req.body.facilityType && req.body.tier) {
      req.body.facilityType = req.body.tier;
    }
    // Map servicesAvailable -> services if sent
    if (!req.body.services && req.body.servicesAvailable) {
      req.body.services = req.body.servicesAvailable;
    }
    // Map contact -> contactInformation if sent
    if (!req.body.contactInformation && req.body.contact) {
      req.body.contactInformation = req.body.contact;
    }
    // Map operationalHours -> operatingHours if sent
    if (!req.body.operatingHours && req.body.operationalHours) {
      req.body.operatingHours = req.body.operationalHours;
    }

    const parsed = createFacilitySchema.parse(req.body);
    req.body = parsed;
    next();
  } catch (err) {
    const errors = err.errors.map((e) => ({
      field: e.path.join('.'),
      message: e.message
    }));
    next(new ApiError(400, 'Validation failed for facility creation', errors));
  }
};

const validateNearbyQuery = (req, res, next) => {
  const { lat, lng } = req.query;
  const errors = [];

  if (!lat || isNaN(parseFloat(lat))) {
    errors.push({ field: 'lat', message: 'Valid latitude is required' });
  }
  if (!lng || isNaN(parseFloat(lng))) {
    errors.push({ field: 'lng', message: 'Valid longitude is required' });
  }

  if (errors.length > 0) {
    return next(new ApiError(400, 'Invalid coordinate parameters', errors));
  }

  next();
};

module.exports = {
  validateCreateFacility,
  validateNearbyQuery,
  createFacilitySchema
};
