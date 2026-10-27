import api from './api';

export const authService = {
  async register(userData) {
    const response = await api.post('/auth/register', userData);
    if (response.data?.data?.token) {
      localStorage.setItem('gram_arogya_token', response.data.data.token);
    }
    return response.data;
  },

  async login(credentials) {
    const response = await api.post('/auth/login', credentials);
    if (response.data?.data?.token) {
      localStorage.setItem('gram_arogya_token', response.data.data.token);
    }
    return response.data;
  },

  async getCurrentUser() {
    const response = await api.get('/auth/me');
    return response.data;
  },

  logout() {
    localStorage.removeItem('gram_arogya_token');
  }
};

export default authService;
