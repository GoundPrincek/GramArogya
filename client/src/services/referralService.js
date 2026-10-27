import api from './api';
import {
  getStoredReferrals,
  updateStoredReferralStatus
} from './storageService';

const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false';

export const referralService = {
  async getMyReferrals() {
    if (USE_MOCK) {
      const list = getStoredReferrals();
      return { success: true, data: list };
    }

    const response = await api.get('/referrals/my');
    return response.data;
  },

  async getFacilityReferrals(facilityId) {
    if (USE_MOCK) {
      const list = getStoredReferrals();
      const filtered = facilityId
        ? list.filter(
            (r) =>
              r.referringFacilityId === facilityId ||
              r.receivingFacilityId === facilityId
          )
        : list;
      return { success: true, data: filtered };
    }

    const response = await api.get(`/referrals/facility/${facilityId}`);
    return response.data;
  },

  async triageReferral(id, status, actionNotes = '') {
    if (USE_MOCK) {
      const updated = updateStoredReferralStatus(id, status, 'Medical Officer', actionNotes);
      return { success: true, data: updated };
    }

    const response = await api.put(`/referrals/${id}/triage`, {
      status,
      actionNotes
    });
    return response.data;
  }
};

export default referralService;
