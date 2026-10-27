/**
 * SYNTHETIC DEMONSTRATION DATA: Platform User Roles
 * Used for simulated login and role-based dashboard switching in Phase 1.
 */
export const MOCK_USERS = [
  {
    id: "usr-patient-001",
    name: "Sunita Patil",
    phone: "9822011223",
    email: "sunita.patil.demo@gramarogya.in",
    role: "patient",
    jurisdiction: {
      district: "Pune",
      taluka: "Haveli",
      village: "Wagholi"
    },
    preferredLanguage: "mr",
    assignedFacility: "Wagholi Primary Health Centre",
    isDemoUser: true
  },
  {
    id: "usr-staff-002",
    name: "Dr. Vikram Joshi",
    phone: "9823055667",
    email: "dr.vikram.joshi@arogya.maharashtra.gov.in",
    role: "doctor",
    jurisdiction: {
      district: "Pune",
      taluka: "Haveli",
      village: "Wagholi"
    },
    preferredLanguage: "mr",
    assignedFacilityId: "fac-mh-pun-001",
    assignedFacility: "Wagholi Primary Health Centre",
    specialization: "Primary Healthcare & Family Medicine",
    isDemoUser: true
  },
  {
    id: "usr-asha-003",
    name: "Mangala Shinde",
    phone: "9823099887",
    email: "mangala.asha@arogya.maharashtra.gov.in",
    role: "asha_worker",
    jurisdiction: {
      district: "Ahmednagar",
      taluka: "Shrigonda",
      village: "Mandavgan"
    },
    preferredLanguage: "mr",
    assignedFacilityId: "fac-mh-ahm-004",
    assignedFacility: "Mandavgan Health Sub-Centre",
    isDemoUser: true
  },
  {
    id: "usr-admin-004",
    name: "Dr. Rajesh Deshmukh",
    phone: "9823000001",
    email: "dho.pune.demo@arogya.maharashtra.gov.in",
    role: "admin",
    jurisdiction: {
      district: "Pune",
      state: "Maharashtra"
    },
    preferredLanguage: "en",
    department: "District Public Health Administration",
    isDemoUser: true
  }
];
