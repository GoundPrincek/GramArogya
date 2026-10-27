const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const generateToken = require('../src/utils/generateToken');
const User = require('../src/models/User');
const Facility = require('../src/models/Facility');
const Appointment = require('../src/models/Appointment');
const Referral = require('../src/models/Referral');
const Notification = require('../src/models/Notification');
const AuditLog = require('../src/models/AuditLog');

let mongoServerInstance = null;

const setupTestDB = async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
  if (!mongoServerInstance) {
    mongoServerInstance = await MongoMemoryServer.create({
      instance: {
        launchTimeout: 60000
      }
    });
  }
  const uri = mongoServerInstance.getUri();
  await mongoose.connect(uri);
};

const teardownTestDB = async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
  if (mongoServerInstance) {
    await mongoServerInstance.stop();
    mongoServerInstance = null;
  }
};

const clearTestDB = async () => {
  if (mongoose.connection.readyState === 1) {
    await Promise.all([
      User.deleteMany({}),
      Facility.deleteMany({}),
      Appointment.deleteMany({}),
      Referral.deleteMany({}),
      Notification.deleteMany({}),
      AuditLog.deleteMany({})
    ]);
  }
};

const createTestUser = async (overrides = {}) => {
  const randomSuffix = Math.floor(100000 + Math.random() * 900000);
  const user = new User({
    name: overrides.name || 'Test User',
    phone: overrides.phone || `982${randomSuffix}`,
    email: overrides.email || `test${randomSuffix}@example.com`,
    role: overrides.role || 'patient',
    facilityId: overrides.facilityId || null,
    preferredLanguage: overrides.preferredLanguage || 'en',
    jurisdiction: overrides.jurisdiction || { district: 'Pune', taluka: 'Haveli', village: 'Wagholi' }
  });
  user.password = overrides.password || 'password123';
  await user.save();

  const token = generateToken({
    id: user._id.toString(),
    role: user.role,
    facilityId: user.facilityId ? user.facilityId.toString() : null
  });

  return { user, token };
};

const createTestFacility = async (overrides = {}) => {
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const type = overrides.facilityType || overrides.tier || 'PHC';
  const facility = await Facility.create({
    name: overrides.name || `PHC Test Center ${randomSuffix}`,
    facilityCode: overrides.facilityCode || `FAC-${randomSuffix}`,
    facilityType: type,
    address: overrides.address || 'Gram Panchayat Road',
    village: overrides.village || 'Wagholi',
    taluka: overrides.taluka || 'Haveli',
    district: overrides.district || 'Pune',
    state: overrides.state || 'Maharashtra',
    pincode: overrides.pincode || '412207',
    coordinates: overrides.coordinates || [73.98, 18.58],
    location: {
      type: 'Point',
      coordinates: overrides.coordinates || [73.98, 18.58]
    },
    services: overrides.services || ['General OPD', 'Maternal Health', 'Vaccination', 'Emergency Care'],
    contactInformation: {
      phone: '020-25678901',
      emergencyPhone: '108',
      email: 'phc@example.gov.in'
    },
    operatingHours: {
      opensAt: '09:00',
      closesAt: '17:00',
      is24x7Emergency: true
    },
    isDemoData: false,
    ...overrides
  });
  return facility;
};

module.exports = {
  setupTestDB,
  teardownTestDB,
  clearTestDB,
  createTestUser,
  createTestFacility
};
