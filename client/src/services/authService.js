import api from './api';
import {
  getStoredCurrentUser,
  setStoredCurrentUser,
  updateStoredCurrentUser
} from './storageService';
import { MOCK_USERS } from '../data/mockUsers';

const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false';

export const authService = {
  async register(userData) {
    if (USE_MOCK) {
      const newUser = {
        id: `usr-${Date.now()}`,
        name: userData.name,
        phone: userData.phone,
        email: userData.email || '',
        role: userData.role || 'patient',
        jurisdiction: userData.jurisdiction || { district: 'Pune', taluka: 'Haveli' },
        preferredLanguage: userData.preferredLanguage || 'mr',
        isDemoUser: true
      };
      setStoredCurrentUser(newUser);
      return { success: true, data: { user: newUser, token: 'demo-token-citizen' } };
    }

    const response = await api.post('/auth/register', userData);
    if (response.data?.data?.token) {
      localStorage.setItem('gram_arogya_token', response.data.data.token);
    }
    return response.data;
  },

  async login(credentials) {
    if (USE_MOCK) {
      // Find matching demo user by role or fallback to first
      const found = MOCK_USERS.find(
        (u) =>
          u.phone === credentials.identifier ||
          u.email === credentials.identifier ||
          u.role === credentials.role
      ) || MOCK_USERS[0];

      setStoredCurrentUser(found);
      return { success: true, data: { user: found, token: `demo-token-${found.role}` } };
    }

    const response = await api.post('/auth/login', credentials);
    if (response.data?.data?.token) {
      localStorage.setItem('gram_arogya_token', response.data.data.token);
    }
    return response.data;
  },

  async getCurrentUser() {
    if (USE_MOCK) {
      const user = getStoredCurrentUser();
      return { success: true, data: user };
    }

    const response = await api.get('/auth/me');
    return response.data;
  },

  async updateProfile(updates) {
    if (USE_MOCK) {
      const updated = updateStoredCurrentUser(updates);
      return { success: true, data: updated };
    }

    const response = await api.put('/users/profile', updates);
    return response.data;
  },

  logout() {
    localStorage.removeItem('gram_arogya_token');
    // We don't wipe the demo user completely, reset to guest or citizen
  }
};

export default authService;
