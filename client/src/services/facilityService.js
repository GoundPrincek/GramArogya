import api from './api';
import {
  getStoredFacilities,
  getStoredFacilityById,
  addStoredFacility,
  updateStoredFacility
} from './storageService';

const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false'; // Default to mock in Phase 1

export const facilityService = {
  async getFacilities(filters = {}) {
    if (USE_MOCK) {
      let facilities = getStoredFacilities();

      if (filters.district) {
        facilities = facilities.filter(
          (f) => f.district.toLowerCase() === filters.district.toLowerCase()
        );
      }
      if (filters.tier) {
        facilities = facilities.filter((f) => f.tier === filters.tier);
      }
      if (filters.service) {
        facilities = facilities.filter((f) =>
          f.servicesAvailable?.some((s) =>
            s.toLowerCase().includes(filters.service.toLowerCase())
          )
        );
      }
      if (filters.search) {
        const query = filters.search.toLowerCase();
        facilities = facilities.filter(
          (f) =>
            f.name.toLowerCase().includes(query) ||
            f.taluka.toLowerCase().includes(query) ||
            f.village?.toLowerCase().includes(query) ||
            f.pincode?.includes(query)
        );
      }

      // Sort
      if (filters.sortBy === 'name_desc') {
        facilities.sort((a, b) => b.name.localeCompare(a.name));
      } else {
        facilities.sort((a, b) => a.name.localeCompare(b.name));
      }

      return { success: true, data: facilities };
    }

    const response = await api.get('/facilities', { params: filters });
    return response.data;
  },

  async getFacilityById(id) {
    if (USE_MOCK) {
      const facility = getStoredFacilityById(id);
      if (!facility) {
        throw new Error('Facility not found');
      }
      return { success: true, data: facility };
    }

    const response = await api.get(`/facilities/${id}`);
    return response.data;
  },

  async createFacility(data) {
    if (USE_MOCK) {
      const created = addStoredFacility(data);
      return { success: true, data: created };
    }

    const response = await api.post('/facilities', data);
    return response.data;
  },

  async updateFacility(id, data) {
    if (USE_MOCK) {
      const updated = updateStoredFacility(id, data);
      return { success: true, data: updated };
    }

    const response = await api.put(`/facilities/${id}`, data);
    return response.data;
  }
};

export default facilityService;
