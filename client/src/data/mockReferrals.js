/**
 * SYNTHETIC DEMONSTRATION DATA: Inter-Facility Clinical Referrals
 * Status values used consistently: 'Created', 'Sent', 'Accepted', 'In Progress', 'Completed', 'Rejected'
 */
export const MOCK_REFERRALS = [
  {
    _id: "ref-001",
    referralCode: "REF-MH-PUN-2026-089",
    patientName: "Sunita Patil",
    patientPhone: "+91 98220 11223",
    referringFacilityId: "fac-mh-pun-001",
    referringFacilityName: "Wagholi Primary Health Centre",
    referringTier: "PHC",
    receivingFacilityId: "fac-mh-pun-003",
    receivingFacilityName: "Aundh District Hospital",
    receivingTier: "DistrictHospital",
    referringDoctor: "Dr. Ananya Kulkarni (Medical Officer, Wagholi PHC)",
    urgencyLevel: "Urgent", // 'Emergency' | 'Urgent' | 'Routine'
    provisionalDiagnosis: "Severe Persistent Gestational Hypertension (BP 150/95)",
    clinicalReason: "Patient requires higher-tier ultrasound doppler and fetal heartbeat monitoring not available at village PHC.",
    vitals: {
      bloodPressure: "150/95 mmHg",
      pulse: 88,
      spo2: "98%",
      temp: "98.6°F"
    },
    status: "Accepted",
    timeline: [
      {
        status: "Created",
        timestamp: new Date(Date.now() - 3600000 * 36).toISOString(),
        actor: "Dr. Ananya Kulkarni",
        note: "Initial assessment at Wagholi PHC indicated elevated blood pressure."
      },
      {
        status: "Sent",
        timestamp: new Date(Date.now() - 3600000 * 32).toISOString(),
        actor: "Wagholi PHC Medical Dispatch",
        note: "Referral case file digitally transmitted to Aundh District Hospital OPD."
      },
      {
        status: "Accepted",
        timestamp: new Date(Date.now() - 3600000 * 20).toISOString(),
        actor: "Dr. Sandeep Shinde (OB/GYN Triage, Aundh DH)",
        note: "Accepted for tertiary maternal triage. Bed allocated in High-Risk Pregnancy Ward."
      }
    ],
    createdAt: new Date(Date.now() - 3600000 * 36).toISOString(),
    isDemoData: true
  },
  {
    _id: "ref-002",
    referralCode: "REF-MH-PUN-2026-042",
    patientName: "Sunita Patil",
    patientPhone: "+91 98220 11223",
    referringFacilityId: "fac-mh-pun-001",
    referringFacilityName: "Wagholi Primary Health Centre",
    referringTier: "PHC",
    receivingFacilityId: "fac-mh-pun-002",
    receivingFacilityName: "Shirur Community Health Centre",
    receivingTier: "CHC",
    referringDoctor: "Dr. Ananya Kulkarni",
    urgencyLevel: "Routine",
    provisionalDiagnosis: "Suspected Left Fibula Stress Fracture",
    clinicalReason: "Patient requires orthopedic digital radiography and orthopedic plaster casting.",
    vitals: {
      bloodPressure: "120/80 mmHg",
      pulse: 74,
      spo2: "99%",
      temp: "98.2°F"
    },
    status: "Completed",
    timeline: [
      {
        status: "Created",
        timestamp: new Date(Date.now() - 86400000 * 8).toISOString(),
        actor: "Dr. Ananya Kulkarni",
        note: "Case originated at PHC following physical exam."
      },
      {
        status: "Sent",
        timestamp: new Date(Date.now() - 86400000 * 7).toISOString(),
        actor: "System Dispatch",
        note: "Digital referral transmitted."
      },
      {
        status: "Accepted",
        timestamp: new Date(Date.now() - 86400000 * 6).toISOString(),
        actor: "Dr. P. R. Deshmukh (Orthopedics, Shirur CHC)",
        note: "Patient scheduled for morning radiographic assessment."
      },
      {
        status: "In Progress",
        timestamp: new Date(Date.now() - 86400000 * 5).toISOString(),
        actor: "Shirur Radiology Dept",
        note: "X-ray imaging completed; hairline crack identified."
      },
      {
        status: "Completed",
        timestamp: new Date(Date.now() - 86400000 * 4).toISOString(),
        actor: "Orthopedic Team",
        note: "Crepe immobilization provided. Patient discharged with home rest advice."
      }
    ],
    createdAt: new Date(Date.now() - 86400000 * 8).toISOString(),
    isDemoData: true
  },
  {
    _id: "ref-003",
    referralCode: "REF-MH-PUN-2026-105",
    patientName: "Sunita Patil",
    patientPhone: "+91 98220 11223",
    referringFacilityId: "fac-mh-ahm-004",
    referringFacilityName: "Mandavgan Health Sub-Centre",
    referringTier: "SubCenter",
    receivingFacilityId: "fac-mh-pun-001",
    receivingFacilityName: "Wagholi Primary Health Centre",
    receivingTier: "PHC",
    referringDoctor: "Mangala Shinde (ANM Staff)",
    urgencyLevel: "Emergency",
    provisionalDiagnosis: "Severe Dehydration secondary to Acute Gastroenteritis",
    clinicalReason: "Urgent intravenous fluid administration required beyond sub-centre capacity.",
    vitals: {
      bloodPressure: "95/60 mmHg",
      pulse: 104,
      spo2: "96%",
      temp: "100.4°F"
    },
    status: "In Progress",
    timeline: [
      {
        status: "Created",
        timestamp: new Date(Date.now() - 3600000 * 6).toISOString(),
        actor: "Mangala Shinde (ANM)",
        note: "Patient triaged at Sub-Centre with active dehydration symptoms."
      },
      {
        status: "Sent",
        timestamp: new Date(Date.now() - 3600000 * 5).toISOString(),
        actor: "Sub-Centre ANM",
        note: "Case escalated to parent Primary Health Centre."
      },
      {
        status: "Accepted",
        timestamp: new Date(Date.now() - 3600000 * 3).toISOString(),
        actor: "Wagholi PHC Medical Officer",
        note: "Emergency IV hydration bay reserved. Patient arriving via local transport."
      },
      {
        status: "In Progress",
        timestamp: new Date(Date.now() - 3600000 * 1).toISOString(),
        actor: "Wagholi Emergency Staff",
        note: "Patient arrived; IV Ringer Lactate infusion actively underway."
      }
    ],
    createdAt: new Date(Date.now() - 3600000 * 6).toISOString(),
    isDemoData: true
  }
];
