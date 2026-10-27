const Facility = require('../models/Facility');
const AuditLog = require('../models/AuditLog');
const ApiError = require('../utils/ApiError');

const getFacilities = async (filters = {}) => {
  const query = {};

  // By default, list active facilities unless admin asks for all
  if (filters.includeInactive !== 'true') {
    query.isActive = true;
  }

  if (filters.district) {
    query.district = new RegExp(`^${filters.district}$`, 'i');
  }
  if (filters.village) {
    query.village = new RegExp(filters.village, 'i');
  }
  const typeParam = filters.facilityType || filters.type || filters.tier;
  if (typeParam) {
    query.facilityType = typeParam;
  }
  if (filters.service) {
    query.services = { $regex: new RegExp(filters.service, 'i') };
  }
  if (filters.search) {
    const searchRegex = new RegExp(filters.search, 'i');
    query.$or = [
      { name: searchRegex },
      { village: searchRegex },
      { taluka: searchRegex },
      { address: searchRegex },
      { pincode: filters.search }
    ];
  }

  // Pagination & Sorting
  const page = Math.max(1, parseInt(filters.page, 10) || 1);
  const limit = Math.min(50, Math.max(1, parseInt(filters.limit, 10) || 20));
  const skip = (page - 1) * limit;

  let sort = { name: 1 };
  if (filters.sortBy === 'name_desc') {
    sort = { name: -1 };
  } else if (filters.sortBy === 'tier') {
    sort = { facilityType: 1, name: 1 };
  } else if (filters.sortBy === 'createdAt') {
    sort = { createdAt: -1 };
  }

  const [facilities, total] = await Promise.all([
    Facility.find(query).sort(sort).skip(skip).limit(limit),
    Facility.countDocuments(query)
  ]);

  return {
    facilities,
    total,
    page,
    totalPages: Math.ceil(total / limit) || 1,
    limit
  };
};

const getNearbyFacilities = async (lng, lat, radiusKm = 30) => {
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
  const facility = await Facility.findById(id);
  if (!facility) {
    throw new ApiError(404, 'Healthcare facility record not found');
  }
  return facility;
};

const createFacility = async (facilityData, actorId) => {
  // If no facility code, auto-generate
  if (!facilityData.facilityCode) {
    const prefix = facilityData.facilityType || 'FAC';
    facilityData.facilityCode = `${prefix}-MH-${Date.now().toString().slice(-4)}`;
  }

  const facility = await Facility.create(facilityData);

  if (actorId) {
    await AuditLog.create({
      actor: actorId,
      action: 'FACILITY_CREATED',
      resourceType: 'Facility',
      resourceId: facility._id,
      metadata: { facilityCode: facility.facilityCode, name: facility.name }
    });
  }

  return facility;
};

const updateFacility = async (id, updateData, actorId) => {
  const facility = await Facility.findById(id);
  if (!facility) {
    throw new ApiError(404, 'Healthcare facility not found');
  }

  Object.assign(facility, updateData);
  await facility.save();

  if (actorId) {
    await AuditLog.create({
      actor: actorId,
      action: 'FACILITY_UPDATED',
      resourceType: 'Facility',
      resourceId: facility._id,
      metadata: { updatedFields: Object.keys(updateData) }
    });
  }

  return facility;
};

const updateFacilityStatus = async (id, isActive, actorId) => {
  const facility = await Facility.findById(id);
  if (!facility) {
    throw new ApiError(404, 'Healthcare facility not found');
  }

  facility.isActive = Boolean(isActive);
  await facility.save();

  if (actorId) {
    await AuditLog.create({
      actor: actorId,
      action: 'FACILITY_STATUS_CHANGED',
      resourceType: 'Facility',
      resourceId: facility._id,
      metadata: { isActive: facility.isActive }
    });
  }

  return facility;
};

module.exports = {
  getFacilities,
  getNearbyFacilities,
  getFacilityById,
  createFacility,
  updateFacility,
  updateFacilityStatus
};
