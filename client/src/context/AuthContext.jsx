import React, { createContext, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import authService from '../services/authService';
import api from '../services/api';
import {
  getStoredCurrentUser,
  setStoredCurrentUser,
  resetDemoData
} from '../services/storageService';
import { MOCK_USERS } from '../data/mockUsers';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const { t, i18n } = useTranslation();
  const [user, setUser] = useState(() => getStoredCurrentUser());
  const [loading, setLoading] = useState(false);
  const [language, setLanguageState] = useState(() => i18n.language || 'mr');

  // Load authenticated user profile from backend on app startup if token exists
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('gram_arogya_token');
      if (token) {
        try {
          const res = await authService.getCurrentUser();
          const currentUser = res?.data?.user || res?.data;
          if (currentUser) {
            setUser(currentUser);
            setStoredCurrentUser(currentUser);
          }
        } catch {
          // Token invalid or expired
          localStorage.removeItem('gram_arogya_token');
        }
      }
    };
    initAuth();
  }, []);

  // Sync state when local storage changes
  useEffect(() => {
    const handleStorageChange = () => {
      setUser(getStoredCurrentUser());
    };

    window.addEventListener('gram_arogya_storage_changed', handleStorageChange);
    return () => {
      window.removeEventListener('gram_arogya_storage_changed', handleStorageChange);
    };
  }, []);

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
    setLanguageState(lang);
    localStorage.setItem('gram_arogya_lang', lang);
  };

  const login = async (credentials) => {
    setLoading(true);
    try {
      const res = await authService.login(credentials);
      const authenticatedUser = res?.data?.user || res?.data;
      if (authenticatedUser) {
        setUser(authenticatedUser);
      }
      return res;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    try {
      const res = await authService.register(userData);
      const registeredUser = res?.data?.user || res?.data;
      if (registeredUser) {
        setUser(registeredUser);
      }
      return res;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    const citizen = MOCK_USERS[0];
    setStoredCurrentUser(citizen);
    setUser(citizen);
  };

  const switchDemoRole = async (role) => {
    const found = MOCK_USERS.find((u) => u.role === role) || MOCK_USERS[0];
    try {
      // Attempt live login with seeded demo account
      const loginPayload = {
        identifier: found.phone || found.email,
        password: 'demopassword123'
      };
      const response = await api.post('/auth/login', loginPayload);
      if (response.data?.data?.token) {
        localStorage.setItem('gram_arogya_token', response.data.data.token);
        const liveUser = response.data.data.user;
        setUser(liveUser);
        setStoredCurrentUser(liveUser);
        return;
      }
    } catch {
      // Backend not running, use client-side demo user
    }
    setStoredCurrentUser(found);
    setUser(found);
  };

  const resetAllDemoData = () => {
    resetDemoData();
    setUser(MOCK_USERS[0]);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        language,
        setLanguage: changeLanguage,
        t,
        login,
        register,
        logout,
        switchDemoRole,
        resetAllDemoData,
        isAuthenticated: !!user
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
