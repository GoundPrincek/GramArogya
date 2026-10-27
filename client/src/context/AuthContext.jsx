import React, { createContext, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import authService from '../services/authService';
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
      if (res?.data?.user) {
        setUser(res.data.user);
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
      if (res?.data?.user) {
        setUser(res.data.user);
      }
      return res;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    // Default back to guest or citizen
    const citizen = MOCK_USERS[0];
    setStoredCurrentUser(citizen);
    setUser(citizen);
  };

  const switchDemoRole = (role) => {
    const found = MOCK_USERS.find((u) => u.role === role) || MOCK_USERS[0];
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
