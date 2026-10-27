/**
 * SYNTHETIC DEMONSTRATION DATA: Healthcare Facilities in Maharashtra
 * These records represent illustrative public health facilities across multiple healthcare tiers.
 * DO NOT treat as live verified hospital availability.
 */
export const MOCK_FACILITIES = [
  {
    _id: "fac-mh-pun-001",
    name: "Wagholi Primary Health Centre",
    facilityCode: "PHC-MH-PUN-001",
    tier: "PHC",
    district: "Pune",
    taluka: "Haveli",
    village: "Wagholi",
    pincode: "412207",
    address: "Near Gram Panchayat Office, Pune-Nagar Road, Wagholi",
    location: {
      type: "Point",
      coordinates: [73.9806, 18.5793] // [lng, lat]
    },
    contact: {
      phone: "+91 20 2700 0101",
      emergencyPhone: "108 / 102",
      email: "phc.wagholi.demo@arogya.maharashtra.gov.in"
    },
    operationalHours: {
      opensAt: "08:00 AM",
      closesAt: "08:00 PM",
      is24x7Emergency: true
    },
    servicesAvailable: [
      "General OPD Consultation",
      "Maternal & Antenatal Checkup",
      "Infant & Child Immunization",
      "Basic Laboratory Pathology",
      "Free Essential Medicine Dispensing",
      "Tuberculosis & Malaria Screening"
    ],
    doctorsCount: 3,
    bedsCount: 10,
    isDemoData: true,
    verificationNote: "Demonstration facility profile for rural healthcare access simulation."
  },
  {
    _id: "fac-mh-pun-002",
    name: "Shirur Community Health Centre",
    facilityCode: "CHC-MH-PUN-002",
    tier: "CHC",
    district: "Pune",
    taluka: "Shirur",
    village: "Shirur",
    pincode: "412210",
    address: "Station Road, Near Bus Stand, Shirur",
    location: {
      type: "Point",
      coordinates: [74.3789, 18.8262]
    },
    contact: {
      phone: "+91 2138 222 100",
      emergencyPhone: "108",
      email: "chc.shirur.demo@arogya.maharashtra.gov.in"
    },
    operationalHours: {
      opensAt: "12:00 AM",
      closesAt: "11:59 PM",
      is24x7Emergency: true
    },
    servicesAvailable: [
      "24x7 Emergency Triage",
      "General Surgery",
      "Obstetrics & Gynecological Unit",
      "Pediatric Inpatient Ward",
      "Digital X-Ray & Ultrasound",
      "Clinical Pathology Lab",
      "Blood Storage Center"
    ],
    doctorsCount: 8,
    bedsCount: 30,
    isDemoData: true,
    verificationNote: "Demonstration secondary referral hospital profile."
  },
  {
    _id: "fac-mh-pun-003",
    name: "Aundh District Hospital",
    facilityCode: "DH-MH-PUN-003",
    tier: "DistrictHospital",
    district: "Pune",
    taluka: "Haveli",
    village: "Aundh",
    pincode: "411027",
    address: "Aundh Camp Road, Near Sangvi Phata, Pune",
    location: {
      type: "Point",
      coordinates: [73.8052, 18.5580]
    },
    contact: {
      phone: "+91 20 2588 1234",
      emergencyPhone: "108",
      email: "districthospital.pune.demo@arogya.maharashtra.gov.in"
    },
    operationalHours: {
      opensAt: "12:00 AM",
      closesAt: "11:59 PM",
      is24x7Emergency: true
    },
    servicesAvailable: [
      "Tertiary Multi-Specialty Outpatient",
      "Intensive Care Unit (ICU)",
      "Trauma & Emergency Care",
      "Licensed Blood Bank",
      "Dialysis Center",
      "Cardiology Consultation",
      "Orthopedic Surgery",
      "CT Scan & Diagnostic Imaging"
    ],
    doctorsCount: 35,
    bedsCount: 300,
    isDemoData: true,
    verificationNote: "Demonstration tertiary referral facility profile."
  },
  {
    _id: "fac-mh-ahm-004",
    name: "Mandavgan Health Sub-Centre",
    facilityCode: "SC-MH-AHM-004",
    tier: "SubCenter",
    district: "Ahmednagar",
    taluka: "Shrigonda",
    village: "Mandavgan",
    pincode: "413701",
    address: "Opposite Village Zilla Parishad School, Mandavgan",
    location: {
      type: "Point",
      coordinates: [74.6989, 18.6180]
    },
    contact: {
      phone: "+91 2487 245 100",
      emergencyPhone: "102 / 108",
      email: "subcenter.mandavgan.demo@arogya.maharashtra.gov.in"
    },
    operationalHours: {
      opensAt: "09:00 AM",
      closesAt: "04:00 PM",
      is24x7Emergency: false
    },
    servicesAvailable: [
      "Grassroots ASHA & ANM Consultations",
      "First Aid & Minor Wound Care",
      "Antenatal Blood Pressure Checkup",
      "Polio & Routine Infant Immunization",
      "Nutrition & Anemia Counseling"
    ],
    doctorsCount: 1,
    bedsCount: 2,
    isDemoData: true,
    verificationNote: "Demonstration grassroots sub-centre profile."
  },
  {
    _id: "fac-mh-nas-005",
    name: "Sinnar Rural Hospital (CHC)",
    facilityCode: "CHC-MH-NAS-005",
    tier: "CHC",
    district: "Nashik",
    taluka: "Sinnar",
    village: "Sinnar",
    pincode: "422103",
    address: "Nashik-Pune Highway, Near Bus Terminal, Sinnar",
    location: {
      type: "Point",
      coordinates: [73.9984, 19.8458]
    },
    contact: {
      phone: "+91 2551 220 045",
      emergencyPhone: "108",
      email: "chc.sinnar.demo@arogya.maharashtra.gov.in"
    },
    operationalHours: {
      opensAt: "12:00 AM",
      closesAt: "11:59 PM",
      is24x7Emergency: true
    },
    servicesAvailable: [
      "24x7 Emergency Room",
      "Maternity Ward & Delivery Suite",
      "Pediatric OPD",
      "Ultrasonography & X-Ray",
      "Pathology Laboratory",
      "Rabies & Snakebite Antivenom"
    ],
    doctorsCount: 6,
    bedsCount: 30,
    isDemoData: true,
    verificationNote: "Demonstration rural secondary hospital profile."
  },
  {
    _id: "fac-mh-sat-006",
    name: "Karad Sub-District Hospital",
    facilityCode: "SDH-MH-SAT-006",
    tier: "SubDistrictHospital",
    district: "Satara",
    taluka: "Karad",
    village: "Karad",
    pincode: "415110",
    address: "Ogalewadi Road, Karad",
    location: {
      type: "Point",
      coordinates: [74.1834, 17.2885]
    },
    contact: {
      phone: "+91 2164 222 555",
      emergencyPhone: "108",
      email: "sdh.karad.demo@arogya.maharashtra.gov.in"
    },
    operationalHours: {
      opensAt: "12:00 AM",
      closesAt: "11:59 PM",
      is24x7Emergency: true
    },
    servicesAvailable: [
      "Multi-Specialty OPD",
      "Inpatient Surgery",
      "Orthopedic Care",
      "Blood Bank Facility",
      "Neonatal Intensive Care (NICU)",
      "Hemodialysis Unit"
    ],
    doctorsCount: 14,
    bedsCount: 100,
    isDemoData: true,
    verificationNote: "Demonstration sub-district hospital profile."
  },
  {
    _id: "fac-mh-sol-007",
    name: "Barshi Primary Health Centre",
    facilityCode: "PHC-MH-SOL-007",
    tier: "PHC",
    district: "Solapur",
    taluka: "Barshi",
    village: "Barshi Rural",
    pincode: "413401",
    address: "Kurduwadi Road, Barshi",
    location: {
      type: "Point",
      coordinates: [75.6946, 18.2335]
    },
    contact: {
      phone: "+91 2184 223 344",
      emergencyPhone: "108 / 102",
      email: "phc.barshi.demo@arogya.maharashtra.gov.in"
    },
    operationalHours: {
      opensAt: "08:30 AM",
      closesAt: "06:30 PM",
      is24x7Emergency: false
    },
    servicesAvailable: [
      "Outpatient Medical Consultations",
      "Free Essential Drugs Supply",
      "Family Planning Guidance",
      "Immunization Drives",
      "Diagnostic Blood & Urine Tests"
    ],
    doctorsCount: 2,
    bedsCount: 6,
    isDemoData: true,
    verificationNote: "Demonstration primary care clinic profile."
  },
  {
    _id: "fac-mh-csb-008",
    name: "Gangapur Community Health Centre",
    facilityCode: "CHC-MH-CSB-008",
    tier: "CHC",
    district: "Chhatrapati Sambhajinagar",
    taluka: "Gangapur",
    village: "Gangapur",
    pincode: "431109",
    address: "Main Road, Near Shivaji Chowk, Gangapur",
    location: {
      type: "Point",
      coordinates: [75.0084, 19.6983]
    },
    contact: {
      phone: "+91 2433 221 112",
      emergencyPhone: "108",
      email: "chc.gangapur.demo@arogya.maharashtra.gov.in"
    },
    operationalHours: {
      opensAt: "12:00 AM",
      closesAt: "11:59 PM",
      is24x7Emergency: true
    },
    servicesAvailable: [
      "24x7 Emergency Care",
      "General Surgery & Gynecology",
      "Infant Vaccination Ward",
      "Routine Pathology",
      "Trauma Stabilization"
    ],
    doctorsCount: 5,
    bedsCount: 30,
    isDemoData: true,
    verificationNote: "Demonstration community referral hospital profile."
  }
];
