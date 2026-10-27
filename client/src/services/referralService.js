import api from './api';
import {
  getStoredReferrals,
  updateStoredReferralStatus
} from './storageService';

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';

export const referralService = {
  async createReferral(data) {
    if (!USE_MOCK) {
      try {
        const response = await api.post('/referrals', data);
        return response.data;
      } catch (err) {
        if (err.response) throw err;
      }
    }

    return {
      success: true,
      data: {
        id: `ref-${Date.now()}`,
        ...data,
        referralCode: `REF-MH-${Date.now().toString().slice(-4)}`,
        status: 'created',
        createdAt: new Date().toISOString()
      }
    };
  },

  async getMyReferrals() {
    if (!USE_MOCK) {
      try {
        const response = await api.get('/referrals/my');
        return response.data;
      } catch (err) {
        if (err.response) throw err;
      }
    }

    const list = getStoredReferrals();
    return { success: true, data: list };
  },

  async getFacilityReferrals(facilityId) {
    if (!USE_MOCK) {
      try {
        const response = await api.get(facilityId ? `/referrals/facility/${facilityId}` : '/referrals');
        return response.data;
      } catch (err) {
        if (err.response) throw err;
      }
    }

    const list = getStoredReferrals();
    const filtered = facilityId
      ? list.filter(
          (r) =>
            r.referringFacilityId === facilityId ||
            r.receivingFacilityId === facilityId
        )
      : list;
    return { success: true, data: filtered };
  },

  async triageReferral(id, status, actionNotes = '') {
    if (!USE_MOCK) {
      try {
        const response = await api.put(`/referrals/${id}/triage`, {
          status,
          actionNotes,
          note: actionNotes
        });
        return response.data;
      } catch (err) {
        if (err.response) throw err;
      }
    }

    const updated = updateStoredReferralStatus(id, status, 'Medical Officer', actionNotes);
    return { success: true, data: updated };
  }
};

export default referralService;
