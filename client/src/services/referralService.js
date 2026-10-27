import api from './api';

export const referralService = {
  async createReferral(data) {
    const response = await api.post('/referrals', data);
    return response.data;
  },

  async getMyReferrals() {
    const response = await api.get('/referrals/my');
    return response.data;
  },

  async getFacilityReferrals(facilityId, direction = 'incoming') {
    const response = await api.get(`/referrals/facility/${facilityId}`, {
      params: { direction }
    });
    return response.data;
  },

  async triageReferral(id, status, actionNotes = '') {
    const response = await api.put(`/referrals/${id}/triage`, {
      status,
      actionNotes
    });
    return response.data;
  }
};

export default referralService;
