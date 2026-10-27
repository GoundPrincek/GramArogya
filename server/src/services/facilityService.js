/**
 * Healthcare Facility Service
 * Handles facility queries, filtering by district/taluka/tier, and geospatial proximity calculations.
 */
const Facility = require('../models/Facility');
const ApiError = require('../utils/ApiError');

const getFacilities = async (filters = {}) => {
  const query = { isActive: true };

  if (filters.district) {
    query['address.district'] = new RegExp(filters.district, 'i');
  }
  if (filters.taluka) {
    query['address.taluka'] = new RegExp(filters.taluka, 'i');
  }
  if (filters.tier) {
    query.tier = filters.tier;
  }
  if (filters.search) {
    query.$or = [
      { name: new RegExp(filters.search, 'i') },
      { 'address.village': new RegExp(filters.search, 'i') },
      { 'address.pincode': filters.search }
    ];
  }

  return Facility.find(query).sort({ name: 1 });
};

const getNearbyFacilities = async (lng, lat, radiusKm = 25) => {
  const radiusInRadians = radiusKm / 6378.1;

  return Facility.find({
    isActive: true,
    location: {
      $geoWithin: {
        $centerSphere: [[lng, lat], radiusInRadians]
      }
    }
  });
};

const getFacilityById = async (id) => {
  const facility = await Facility.findById(id).populate('parentFacilityId', 'name tier contact');
  if (!facility) {
    throw new ApiError(404, 'Healthcare facility not found');
  }
  return facility;
};

const createFacility = async (data) => {
  const existing = await Facility.findOne({ facilityCode: data.facilityCode });
  if (existing) {
    throw new ApiError(409, 'Facility code already registered');
  }
  return Facility.create(data);
};

module.exports = {
  getFacilities,
  getNearbyFacilities,
  getFacilityById,
  createFacility
};
