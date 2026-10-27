import api from './api';
import {
  getStoredAppointments,
  addStoredAppointment,
  updateStoredAppointmentStatus
} from './storageService';

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';

export const appointmentService = {
  async bookAppointment(data) {
    if (!USE_MOCK) {
      try {
        const response = await api.post('/appointments', data);
        return response.data;
      } catch (err) {
        if (err.response) throw err;
        console.warn('[API Warning] Backend unreachable, falling back to local storage');
      }
    }

    const created = addStoredAppointment(data);
    return { success: true, data: created };
  },

  async getMyAppointments() {
    if (!USE_MOCK) {
      try {
        const response = await api.get('/appointments/my');
        return response.data;
      } catch (err) {
        if (err.response) throw err;
      }
    }

    const list = getStoredAppointments();
    return { success: true, data: list };
  },

  async getFacilityAppointments(facilityId) {
    if (!USE_MOCK) {
      try {
        const response = await api.get(facilityId ? `/appointments/facility/${facilityId}` : '/appointments');
        return response.data;
      } catch (err) {
        if (err.response) throw err;
      }
    }

    const list = getStoredAppointments();
    const filtered = facilityId
      ? list.filter((a) => a.facilityId === facilityId)
      : list;
    return { success: true, data: filtered };
  },

  async updateAppointmentStatus(id, status, consultationNotes = '', decisionReason = '') {
    if (!USE_MOCK) {
      try {
        const response = await api.put(`/appointments/${id}/status`, {
          status,
          consultationNotes,
          decisionReason: decisionReason || consultationNotes,
          reason: decisionReason || consultationNotes
        });
        return response.data;
      } catch (err) {
        if (err.response) throw err;
      }
    }

    const updated = updateStoredAppointmentStatus(id, status, consultationNotes);
    return { success: true, data: updated };
  },

  async cancelAppointment(id, reason = '') {
    if (!USE_MOCK) {
      try {
        const response = await api.patch(`/appointments/${id}/cancel`, { reason });
        return response.data;
      } catch (err) {
        if (err.response) throw err;
      }
    }

    const updated = updateStoredAppointmentStatus(id, 'cancelled', reason);
    return { success: true, data: updated };
  }
};

export default appointmentService;
