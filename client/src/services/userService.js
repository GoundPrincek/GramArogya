import api from './api';

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';

export const userService = {
  async getAllUsers(params = {}) {
    if (!USE_MOCK) {
      try {
        const response = await api.get('/users', { params });
        return response.data;
      } catch (err) {
        if (err.response) throw err;
      }
    }

    return {
      success: true,
      data: []
    };
  },

  async updateUserRole(id, data) {
    if (!USE_MOCK) {
      try {
        const response = await api.patch(`/users/${id}/role`, data);
        return response.data;
      } catch (err) {
        if (err.response) throw err;
      }
    }

    return { success: true };
  }
};

export default userService;
