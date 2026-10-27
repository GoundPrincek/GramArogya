/**
 * Database Seeder for Rural Healthcare Facilities in Maharashtra
 * Seeds fictional sample data for Sub-Centers, PHCs, CHCs, and District Hospitals.
 */
const mongoose = require('mongoose');
const config = require('../src/config/env');
const Facility = require('../src/models/Facility');

const sampleFacilities = [
  {
    name: 'Wagholi Primary Health Centre',
    facilityCode: 'PHC-MH-PUN-001',
    tier: 'PHC',
    contact: { phone: '020-27000101', emergencyPhone: '020-27000102' },
    address: {
      street: 'Near Gram Panchayat Office',
      village: 'Wagholi',
      taluka: 'Haveli',
      district: 'Pune',
      state: 'Maharashtra',
      pincode: '412207'
    },
    location: {
      type: 'Point',
      coordinates: [73.9806, 18.5793]
    },
    servicesAvailable: ['General OPD', 'Maternal Health', 'Immunization', 'Basic Pathology'],
    operationalHours: { opensAt: '08:00', closesAt: '20:00', is24x7Emergency: true }
  },
  {
    name: 'Shirur Community Health Centre',
    facilityCode: 'CHC-MH-PUN-002',
    tier: 'CHC',
    contact: { phone: '02138-222100', emergencyPhone: '02138-222101' },
    address: {
      street: 'Station Road',
      village: 'Shirur',
      taluka: 'Shirur',
      district: 'Pune',
      state: 'Maharashtra',
      pincode: '412210'
    },
    location: {
      type: 'Point',
      coordinates: [74.3789, 18.8262]
    },
    servicesAvailable: ['Emergency Trauma', 'Surgery', 'Pediatrics', 'Obstetrics', 'X-Ray', 'Laboratory'],
    operationalHours: { opensAt: '00:00', closesAt: '23:59', is24x7Emergency: true }
  },
  {
    name: 'Aundh District Hospital',
    facilityCode: 'DH-MH-PUN-003',
    tier: 'DistrictHospital',
    contact: { phone: '020-25881234', emergencyPhone: '020-25881235' },
    address: {
      street: 'Aundh Camp Road',
      village: 'Aundh',
      taluka: 'Haveli',
      district: 'Pune',
      state: 'Maharashtra',
      pincode: '411027'
    },
    location: {
      type: 'Point',
      coordinates: [73.8052, 18.558]
    },
    servicesAvailable: ['ICU', 'Cardiology', 'Neurology', 'Orthopedics', 'Blood Bank', 'CT Scan'],
    operationalHours: { opensAt: '00:00', closesAt: '23:59', is24x7Emergency: true }
  },
  {
    name: 'Mandavgan Sub-Centre',
    facilityCode: 'SC-MH-AHM-004',
    tier: 'SubCenter',
    contact: { phone: '02487-245100' },
    address: {
      street: 'Main Bazaar Road',
      village: 'Mandavgan',
      taluka: 'Shrigonda',
      district: 'Ahmednagar',
      state: 'Maharashtra',
      pincode: '413701'
    },
    location: {
      type: 'Point',
      coordinates: [74.6989, 18.618]
    },
    servicesAvailable: ['First Aid', 'ASHA Guidance', 'Maternal Checkup', 'Polio Immunization'],
    operationalHours: { opensAt: '09:00', closesAt: '16:00', is24x7Emergency: false }
  }
];

const seedDatabase = async () => {
  try {
    console.log(`Connecting to MongoDB at ${config.mongodbUri}...`);
    await mongoose.connect(config.mongodbUri);
    console.log('MongoDB connected successfully for seeding.');

    await Facility.deleteMany({});
    console.log('Existing facilities cleared.');

    const created = await Facility.insertMany(sampleFacilities);
    console.log(`Successfully seeded ${created.length} healthcare facilities.`);

    await mongoose.disconnect();
    console.log('Database disconnected.');
    process.exit(0);
  } catch (error) {
    console.error(`Seeding error: ${error.message}`);
    process.exit(1);
  }
};

if (require.main === module) {
  seedDatabase();
}

module.exports = sampleFacilities;
