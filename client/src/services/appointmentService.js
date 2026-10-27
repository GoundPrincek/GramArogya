import api from './api';

export const appointmentService = {
  async bookAppointment(data) {
    const response = await api.post('/appointments', data);
    return response.data;
  },

  async getMyAppointments() {
    const response = await api.get('/appointments/my');
    return response.data;
  },

  async getFacilityAppointments(facilityId, date) {
    const response = await api.get(`/appointments/facility/${facilityId}`, {
      params: { date }
    });
    return response.data;
  },

  async updateAppointmentStatus(id, status, consultationNotes = '') {
    const response = await api.put(`/appointments/${id}/status`, {
      status,
      consultationNotes
    });
    return response.data;
  }
};

export default appointmentService;
