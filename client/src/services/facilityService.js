import api from './api';

export const facilityService = {
  async getFacilities(params = {}) {
    const response = await api.get('/facilities', { params });
    return response.data;
  },

  async getNearbyFacilities(lat, lng, radiusKm = 25) {
    const response = await api.get('/facilities/nearby', {
      params: { lat, lng, radiusKm }
    });
    return response.data;
  },

  async getFacilityById(id) {
    const response = await api.get(`/facilities/${id}`);
    return response.data;
  },

  async createFacility(data) {
    const response = await api.post('/facilities', data);
    return response.data;
  }
};

export default facilityService;
