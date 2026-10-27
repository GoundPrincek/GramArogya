import api from './api';
import {
  getStoredCurrentUser,
  setStoredCurrentUser,
  updateStoredCurrentUser
} from './storageService';
import { MOCK_USERS } from '../data/mockUsers';

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';

export const authService = {
  async register(userData) {
    if (!USE_MOCK) {
      try {
        const response = await api.post('/auth/register', userData);
        if (response.data?.data?.token) {
          localStorage.setItem('gram_arogya_token', response.data.data.token);
        }
        if (response.data?.data?.user) {
          setStoredCurrentUser(response.data.data.user);
        }
        return response.data;
      } catch (err) {
        if (err.response) throw err;
        console.warn('[API Warning] Backend unreachable, falling back to local simulation mode');
      }
    }

    // Mock fallback
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
  },

  async login(credentials) {
    if (!USE_MOCK) {
      try {
        const response = await api.post('/auth/login', credentials);
        if (response.data?.data?.token) {
          localStorage.setItem('gram_arogya_token', response.data.data.token);
        }
        if (response.data?.data?.user) {
          setStoredCurrentUser(response.data.data.user);
        }
        return response.data;
      } catch (err) {
        if (err.response) throw err;
        console.warn('[API Warning] Backend unreachable, falling back to local simulation mode');
      }
    }

    // Mock fallback
    const found = MOCK_USERS.find(
      (u) =>
        u.phone === credentials.identifier ||
        u.email === credentials.identifier ||
        u.role === credentials.role
    ) || MOCK_USERS[0];

    setStoredCurrentUser(found);
    return { success: true, data: { user: found, token: `demo-token-${found.role}` } };
  },

  async getCurrentUser() {
    if (!USE_MOCK) {
      try {
        const response = await api.get('/auth/me');
        return response.data;
      } catch (err) {
        if (err.response?.status === 401) {
          localStorage.removeItem('gram_arogya_token');
          throw err;
        }
        // If network error, fall back
      }
    }

    const user = getStoredCurrentUser();
    return { success: true, data: { user } };
  },

  async updateProfile(updates) {
    if (!USE_MOCK) {
      try {
        const response = await api.patch('/users/me', updates);
        if (response.data?.data?.user) {
          setStoredCurrentUser(response.data.data.user);
        }
        return response.data;
      } catch (err) {
        if (err.response) throw err;
      }
    }

    const updated = updateStoredCurrentUser(updates);
    return { success: true, data: { user: updated } };
  },

  logout() {
    try {
      api.post('/auth/logout').catch(() => {});
    } finally {
      localStorage.removeItem('gram_arogya_token');
    }
  }
};

export default authService;
