/**
 * SYNTHETIC DEMONSTRATION DATA: In-App User Notifications
 */
export const MOCK_NOTIFICATIONS = [
  {
    _id: "notif-001",
    recipientRole: "patient",
    title: "Appointment Request Accepted",
    message: "Your appointment for Maternal & Antenatal Checkup at Wagholi PHC has been accepted for tomorrow at 10:00 AM (Token #8).",
    type: "appointment",
    isRead: false,
    createdAt: new Date(Date.now() - 3600000 * 3).toISOString()
  },
  {
    _id: "notif-002",
    recipientRole: "patient",
    title: "Referral Transfer Accepted",
    message: "Aundh District Hospital has accepted your clinical referral from Wagholi PHC. High-Risk Pregnancy Ward reserved.",
    type: "referral",
    isRead: false,
    createdAt: new Date(Date.now() - 3600000 * 20).toISOString()
  },
  {
    _id: "notif-003",
    recipientRole: "patient",
    title: "Mission Indradhanush Immunization Drive",
    message: "National immunization session at Wagholi PHC this Wednesday from 09:00 AM to 02:00 PM for all children under 2 years.",
    type: "broadcast",
    isRead: true,
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString()
  },
  {
    _id: "notif-004",
    recipientRole: "patient",
    title: "Seasonal Monsoon Health Advisory",
    message: "Boil drinking water and report fevers lasting longer than 48 hours to your village ASHA worker immediately.",
    type: "broadcast",
    isRead: true,
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString()
  }
];
