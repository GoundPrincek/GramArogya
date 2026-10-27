/**
 * SYNTHETIC DEMONSTRATION DATA SEEDER FOR GRAMAROGYA CONNECT
 * Seeds realistic demonstration data for Maharashtra public healthcare coordination:
 * - Facilities (Sub-Centers, PHCs, CHCs, District Hospitals)
 * - Users (Patient, Staff/Medical Officer, District Administrator)
 * - Appointments (Pending, Accepted, Completed)
 * - Clinical Referrals (with multi-step status history)
 * - Notifications
 */
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const config = require('../src/config/env');
const User = require('../src/models/User');
const Facility = require('../src/models/Facility');
const Appointment = require('../src/models/Appointment');
const Referral = require('../src/models/Referral');
const Notification = require('../src/models/Notification');
const AuditLog = require('../src/models/AuditLog');

const sampleFacilities = [
  {
    name: 'Wagholi Primary Health Centre',
    facilityCode: 'PHC-MH-PUN-001',
    facilityType: 'PHC',
    district: 'Pune',
    taluka: 'Haveli',
    village: 'Wagholi',
    pincode: '412207',
    address: 'Near Gram Panchayat Office, Pune-Nagar Road, Wagholi',
    coordinates: [73.9806, 18.5793],
    location: { type: 'Point', coordinates: [73.9806, 18.5793] },
    contactInformation: {
      phone: '+91 20 2700 0101',
      emergencyPhone: '108 / 102',
      email: 'phc.wagholi.demo@arogya.maharashtra.gov.in'
    },
    operatingHours: {
      opensAt: '08:00 AM',
      closesAt: '08:00 PM',
      is24x7Emergency: true
    },
    services: [
      'General OPD Consultation',
      'Maternal & Antenatal Checkup',
      'Infant & Child Immunization',
      'Basic Laboratory Pathology',
      'Free Essential Medicine Dispensing',
      'Tuberculosis & Malaria Screening'
    ],
    isActive: true,
    isDemoData: true
  },
  {
    name: 'Shirur Community Health Centre',
    facilityCode: 'CHC-MH-PUN-002',
    facilityType: 'CHC',
    district: 'Pune',
    taluka: 'Shirur',
    village: 'Shirur',
    pincode: '412210',
    address: 'Station Road, Near Bus Stand, Shirur',
    coordinates: [74.3789, 18.8262],
    location: { type: 'Point', coordinates: [74.3789, 18.8262] },
    contactInformation: {
      phone: '+91 2138 222 100',
      emergencyPhone: '108',
      email: 'chc.shirur.demo@arogya.maharashtra.gov.in'
    },
    operatingHours: {
      opensAt: '12:00 AM',
      closesAt: '11:59 PM',
      is24x7Emergency: true
    },
    services: [
      '24x7 Emergency Triage',
      'General Surgery',
      'Obstetrics & Gynecological Unit',
      'Pediatric Inpatient Ward',
      'Digital X-Ray & Ultrasound',
      'Clinical Pathology Lab'
    ],
    isActive: true,
    isDemoData: true
  },
  {
    name: 'Aundh District Hospital',
    facilityCode: 'DH-MH-PUN-003',
    facilityType: 'DistrictHospital',
    district: 'Pune',
    taluka: 'Haveli',
    village: 'Aundh',
    pincode: '411027',
    address: 'Aundh Camp Road, Near Sangvi Phata, Pune',
    coordinates: [73.8052, 18.5580],
    location: { type: 'Point', coordinates: [73.8052, 18.5580] },
    contactInformation: {
      phone: '+91 20 2588 1234',
      emergencyPhone: '108',
      email: 'districthospital.pune.demo@arogya.maharashtra.gov.in'
    },
    operatingHours: {
      opensAt: '12:00 AM',
      closesAt: '11:59 PM',
      is24x7Emergency: true
    },
    services: [
      'Tertiary Multi-Specialty Outpatient',
      'Intensive Care Unit (ICU)',
      'Trauma & Emergency Care',
      'Licensed Blood Bank',
      'Dialysis Center',
      'CT Scan & Diagnostic Imaging'
    ],
    isActive: true,
    isDemoData: true
  },
  {
    name: 'Mandavgan Health Sub-Centre',
    facilityCode: 'SC-MH-AHM-004',
    facilityType: 'SubCenter',
    district: 'Ahmednagar',
    taluka: 'Shrigonda',
    village: 'Mandavgan',
    pincode: '413701',
    address: 'Opposite Village Zilla Parishad School, Mandavgan',
    coordinates: [74.6989, 18.6180],
    location: { type: 'Point', coordinates: [74.6989, 18.6180] },
    contactInformation: {
      phone: '+91 2487 245 100',
      emergencyPhone: '102 / 108',
      email: 'subcenter.mandavgan.demo@arogya.maharashtra.gov.in'
    },
    operatingHours: {
      opensAt: '09:00 AM',
      closesAt: '04:00 PM',
      is24x7Emergency: false
    },
    services: [
      'Grassroots ASHA & ANM Consultations',
      'First Aid & Minor Wound Care',
      'Antenatal Blood Pressure Checkup',
      'Polio & Routine Infant Immunization'
    ],
    isActive: true,
    isDemoData: true
  }
];

const sanitizeUri = (rawUri) => {
  if (!rawUri) return '<empty>';
  return rawUri.replace(/\/\/[^:]+:[^@]+@/, '//***:***@');
};

const seedDatabase = async () => {
  try {
    console.log(`[Seeder] Connecting to MongoDB at ${sanitizeUri(config.mongodbUri)}...`);
    await mongoose.connect(config.mongodbUri, { serverSelectionTimeoutMS: 20000 });
    console.log('[Seeder] Connected successfully.');

    // 1. Seed Facilities
    await Facility.deleteMany({});
    const createdFacilities = await Facility.insertMany(sampleFacilities);
    console.log(`[Seeder] Created ${createdFacilities.length} facilities.`);

    const wagholiPHC = createdFacilities.find((f) => f.facilityCode === 'PHC-MH-PUN-001');
    const aundhDH = createdFacilities.find((f) => f.facilityCode === 'DH-MH-PUN-003');

    // 2. Seed Users
    await User.deleteMany({});
    const defaultPassword = 'demopassword123';
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(defaultPassword, salt);

    const demoUsers = [
      {
        name: 'Sunita Patil',
        phone: '9822011223',
        email: 'sunita.patil.demo@gramarogya.in',
        passwordHash,
        role: 'patient',
        preferredLanguage: 'mr',
        jurisdiction: { state: 'Maharashtra', district: 'Pune', taluka: 'Haveli', village: 'Wagholi' }
      },
      {
        name: 'Dr. Vikram Joshi',
        phone: '9823055667',
        email: 'dr.vikram.joshi@arogya.maharashtra.gov.in',
        passwordHash,
        role: 'staff',
        facilityId: wagholiPHC._id,
        preferredLanguage: 'mr',
        jurisdiction: { state: 'Maharashtra', district: 'Pune', taluka: 'Haveli', village: 'Wagholi' }
      },
      {
        name: 'Dr. Rajesh Deshmukh',
        phone: '9823000001',
        email: 'admin@arogya.maharashtra.gov.in',
        passwordHash,
        role: 'admin',
        preferredLanguage: 'en',
        jurisdiction: { state: 'Maharashtra', district: 'Pune' }
      }
    ];

    const createdUsers = await User.insertMany(demoUsers);
    console.log(`[Seeder] Created ${createdUsers.length} demo users (Patient, Staff, Admin).`);

    const patientUser = createdUsers.find((u) => u.role === 'patient');
    const staffUser = createdUsers.find((u) => u.role === 'staff');

    // 3. Seed Appointments
    await Appointment.deleteMany({});
    const demoAppointments = [
      {
        patient: patientUser._id,
        facility: wagholiPHC._id,
        requestedService: 'Maternal & Antenatal Checkup',
        preferredDate: new Date(Date.now() + 86400000), // Tomorrow
        preferredTime: '10:00 AM - 11:30 AM',
        tokenNumber: 8,
        status: 'accepted',
        notes: 'Routine 2nd trimester antenatal checkup and BP monitoring.',
        reviewedBy: staffUser._id
      },
      {
        patient: patientUser._id,
        facility: wagholiPHC._id,
        requestedService: 'General OPD Consultation',
        preferredDate: new Date(Date.now() + 86400000 * 3),
        preferredTime: '09:30 AM - 11:00 AM',
        tokenNumber: 14,
        status: 'pending',
        notes: 'Seasonal viral fever and body ache.'
      }
    ];
    await Appointment.insertMany(demoAppointments);
    console.log('[Seeder] Created demo appointments.');

    // 4. Seed Referrals
    await Referral.deleteMany({});
    const demoReferral = {
      referralCode: 'REF-MH-2026-1042',
      patient: patientUser._id,
      referringFacility: wagholiPHC._id,
      receivingFacility: aundhDH._id,
      referralReason: 'Persistent gestational hypertension requiring tertiary doppler ultrasound.',
      provisionalDiagnosis: 'Severe Gestational Hypertension (BP 150/95)',
      urgencyLevel: 'Urgent',
      status: 'accepted',
      createdBy: staffUser._id,
      statusHistory: [
        {
          status: 'created',
          timestamp: new Date(Date.now() - 3600000 * 24),
          actor: 'Dr. Vikram Joshi',
          actorId: staffUser._id,
          note: 'Case originated at Wagholi PHC.'
        },
        {
          status: 'accepted',
          timestamp: new Date(Date.now() - 3600000 * 12),
          actor: 'Aundh Triage Desk',
          note: 'Bed reserved in high-risk maternal unit.'
        }
      ]
    };
    await Referral.create(demoReferral);
    console.log('[Seeder] Created demo clinical referral.');

    // 5. Seed Notifications
    await Notification.deleteMany({});
    const demoNotifications = [
      {
        user: patientUser._id,
        title: 'Appointment Request Accepted',
        message: 'Your appointment for Maternal & Antenatal Checkup at Wagholi PHC has been accepted (Token #8).',
        type: 'appointment',
        isRead: false
      },
      {
        user: patientUser._id,
        title: 'Referral Case Accepted',
        message: 'Aundh District Hospital has accepted your clinical referral from Wagholi PHC.',
        type: 'referral',
        isRead: true
      }
    ];
    await Notification.insertMany(demoNotifications);
    console.log('[Seeder] Created demo notifications.');

    console.log('\n======================================================');
    console.log('DEMONSTRATION USERS PROVISIONED:');
    console.log('1. Citizen / Patient:');
    console.log('   Phone: 9822011223 | Password: demopassword123');
    console.log('2. Medical Staff / Doctor (Wagholi PHC):');
    console.log('   Phone: 9823055667 | Password: demopassword123');
    console.log('3. District Health Admin:');
    console.log('   Phone: 9823000001 | Password: demopassword123');
    console.log('======================================================\n');

    await mongoose.disconnect();
    console.log('[Seeder] Seeding finished successfully. Database disconnected.');
  } catch (error) {
    console.error(`[Seeder Error]: ${error.message}`);
    process.exit(1);
  }
};

if (require.main === module) {
  seedDatabase();
}

module.exports = { seedDatabase, sampleFacilities };
