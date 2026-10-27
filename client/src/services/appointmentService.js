import api from './api';
import {
  getStoredAppointments,
  addStoredAppointment,
  updateStoredAppointmentStatus
} from './storageService';

const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false';

export const appointmentService = {
  async bookAppointment(data) {
    if (USE_MOCK) {
      const created = addStoredAppointment(data);
      return { success: true, data: created };
    }

    const response = await api.post('/appointments', data);
    return response.data;
  },

  async getMyAppointments() {
    if (USE_MOCK) {
      const list = getStoredAppointments();
      return { success: true, data: list };
    }

    const response = await api.get('/appointments/my');
    return response.data;
  },

  async getFacilityAppointments(facilityId) {
    if (USE_MOCK) {
      const list = getStoredAppointments();
      const filtered = facilityId
        ? list.filter((a) => a.facilityId === facilityId)
        : list;
      return { success: true, data: filtered };
    }

    const response = await api.get(`/appointments/facility/${facilityId}`);
    return response.data;
  },

  async updateAppointmentStatus(id, status, consultationNotes = '') {
    if (USE_MOCK) {
      const updated = updateStoredAppointmentStatus(id, status, consultationNotes);
      return { success: true, data: updated };
    }

    const response = await api.put(`/appointments/${id}/status`, {
      status,
      consultationNotes
    });
    return response.data;
  }
};

export default appointmentService;
