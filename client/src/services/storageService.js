import { MOCK_FACILITIES } from '../data/mockFacilities';
import { MOCK_APPOINTMENTS } from '../data/mockAppointments';
import { MOCK_REFERRALS } from '../data/mockReferrals';
import { MOCK_NOTIFICATIONS } from '../data/mockNotifications';
import { MOCK_USERS } from '../data/mockUsers';

const KEYS = {
  FACILITIES: 'gram_arogya_demo_facilities',
  APPOINTMENTS: 'gram_arogya_demo_appointments',
  REFERRALS: 'gram_arogya_demo_referrals',
  NOTIFICATIONS: 'gram_arogya_demo_notifications',
  CURRENT_USER: 'gram_arogya_demo_user',
  INIT_FLAG: 'gram_arogya_demo_initialized'
};

/**
 * Initialize local storage with default mock data if first time
 */
export const initializeStorage = () => {
  if (!localStorage.getItem(KEYS.INIT_FLAG)) {
    localStorage.setItem(KEYS.FACILITIES, JSON.stringify(MOCK_FACILITIES));
    localStorage.setItem(KEYS.APPOINTMENTS, JSON.stringify(MOCK_APPOINTMENTS));
    localStorage.setItem(KEYS.REFERRALS, JSON.stringify(MOCK_REFERRALS));
    localStorage.setItem(KEYS.NOTIFICATIONS, JSON.stringify(MOCK_NOTIFICATIONS));
    localStorage.setItem(KEYS.CURRENT_USER, JSON.stringify(MOCK_USERS[0])); // Default citizen
    localStorage.setItem(KEYS.INIT_FLAG, 'true');
  }
};

/**
 * Reset all demo data back to default initial synthetic state
 */
export const resetDemoData = () => {
  localStorage.setItem(KEYS.FACILITIES, JSON.stringify(MOCK_FACILITIES));
  localStorage.setItem(KEYS.APPOINTMENTS, JSON.stringify(MOCK_APPOINTMENTS));
  localStorage.setItem(KEYS.REFERRALS, JSON.stringify(MOCK_REFERRALS));
  localStorage.setItem(KEYS.NOTIFICATIONS, JSON.stringify(MOCK_NOTIFICATIONS));
  localStorage.setItem(KEYS.CURRENT_USER, JSON.stringify(MOCK_USERS[0]));
  localStorage.setItem(KEYS.INIT_FLAG, 'true');
  window.dispatchEvent(new Event('gram_arogya_storage_changed'));
};

/* ---------------- FACILITIES ---------------- */
export const getStoredFacilities = () => {
  initializeStorage();
  try {
    return JSON.parse(localStorage.getItem(KEYS.FACILITIES)) || MOCK_FACILITIES;
  } catch {
    return MOCK_FACILITIES;
  }
};

export const getStoredFacilityById = (id) => {
  const list = getStoredFacilities();
  return list.find((f) => f._id === id) || null;
};

export const addStoredFacility = (facilityData) => {
  const list = getStoredFacilities();
  const newFacility = {
    ...facilityData,
    _id: `fac-custom-${Date.now()}`,
    isDemoData: true
  };
  list.unshift(newFacility);
  localStorage.setItem(KEYS.FACILITIES, JSON.stringify(list));
  window.dispatchEvent(new Event('gram_arogya_storage_changed'));
  return newFacility;
};

export const updateStoredFacility = (id, updatedFields) => {
  const list = getStoredFacilities();
  const index = list.findIndex((f) => f._id === id);
  if (index !== -1) {
    list[index] = { ...list[index], ...updatedFields };
    localStorage.setItem(KEYS.FACILITIES, JSON.stringify(list));
    window.dispatchEvent(new Event('gram_arogya_storage_changed'));
    return list[index];
  }
  return null;
};

/* ---------------- APPOINTMENTS ---------------- */
export const getStoredAppointments = () => {
  initializeStorage();
  try {
    return JSON.parse(localStorage.getItem(KEYS.APPOINTMENTS)) || MOCK_APPOINTMENTS;
  } catch {
    return MOCK_APPOINTMENTS;
  }
};

export const addStoredAppointment = (appointmentData) => {
  const list = getStoredAppointments();
  const countToday = list.filter((a) => a.facilityId === appointmentData.facilityId).length;
  const newAppointment = {
    ...appointmentData,
    _id: `apt-${Date.now()}`,
    tokenNumber: countToday + 1,
    status: 'Pending',
    createdAt: new Date().toISOString(),
    isDemoData: true
  };
  list.unshift(newAppointment);
  localStorage.setItem(KEYS.APPOINTMENTS, JSON.stringify(list));
  window.dispatchEvent(new Event('gram_arogya_storage_changed'));
  return newAppointment;
};

export const updateStoredAppointmentStatus = (id, status, notes = '') => {
  const list = getStoredAppointments();
  const index = list.findIndex((a) => a._id === id);
  if (index !== -1) {
    list[index].status = status;
    if (notes) list[index].consultationNotes = notes;
    localStorage.setItem(KEYS.APPOINTMENTS, JSON.stringify(list));
    window.dispatchEvent(new Event('gram_arogya_storage_changed'));
    return list[index];
  }
  return null;
};

/* ---------------- REFERRALS ---------------- */
export const getStoredReferrals = () => {
  initializeStorage();
  try {
    return JSON.parse(localStorage.getItem(KEYS.REFERRALS)) || MOCK_REFERRALS;
  } catch {
    return MOCK_REFERRALS;
  }
};

export const updateStoredReferralStatus = (id, newStatus, actor = 'Medical Staff', note = '') => {
  const list = getStoredReferrals();
  const index = list.findIndex((r) => r._id === id);
  if (index !== -1) {
    list[index].status = newStatus;
    list[index].timeline = list[index].timeline || [];
    list[index].timeline.push({
      status: newStatus,
      timestamp: new Date().toISOString(),
      actor,
      note: note || `Referral status updated to ${newStatus}`
    });
    localStorage.setItem(KEYS.REFERRALS, JSON.stringify(list));
    window.dispatchEvent(new Event('gram_arogya_storage_changed'));
    return list[index];
  }
  return null;
};

/* ---------------- NOTIFICATIONS ---------------- */
export const getStoredNotifications = () => {
  initializeStorage();
  try {
    return JSON.parse(localStorage.getItem(KEYS.NOTIFICATIONS)) || MOCK_NOTIFICATIONS;
  } catch {
    return MOCK_NOTIFICATIONS;
  }
};

export const markStoredNotificationRead = (id) => {
  const list = getStoredNotifications();
  const item = list.find((n) => n._id === id);
  if (item) {
    item.isRead = true;
    localStorage.setItem(KEYS.NOTIFICATIONS, JSON.stringify(list));
    window.dispatchEvent(new Event('gram_arogya_storage_changed'));
  }
};

export const markAllStoredNotificationsRead = () => {
  const list = getStoredNotifications();
  list.forEach((n) => (n.isRead = true));
  localStorage.setItem(KEYS.NOTIFICATIONS, JSON.stringify(list));
  window.dispatchEvent(new Event('gram_arogya_storage_changed'));
};

/* ---------------- CURRENT USER / ROLE ---------------- */
export const getStoredCurrentUser = () => {
  initializeStorage();
  try {
    return JSON.parse(localStorage.getItem(KEYS.CURRENT_USER)) || MOCK_USERS[0];
  } catch {
    return MOCK_USERS[0];
  }
};

export const setStoredCurrentUser = (user) => {
  localStorage.setItem(KEYS.CURRENT_USER, JSON.stringify(user));
  window.dispatchEvent(new Event('gram_arogya_storage_changed'));
};

export const updateStoredCurrentUser = (updates) => {
  const current = getStoredCurrentUser();
  const updated = { ...current, ...updates };
  setStoredCurrentUser(updated);
  return updated;
};
