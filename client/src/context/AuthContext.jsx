import React, { createContext, useState, useEffect } from 'react';
import authService from '../services/authService';
import en from '../locales/en.json';
import mr from '../locales/mr.json';
import hi from '../locales/hi.json';

export const AuthContext = createContext(null);

const translations = { en, mr, hi };

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [language, setLanguage] = useState(localStorage.getItem('gram_arogya_lang') || 'mr');

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('gram_arogya_token');
      if (token) {
        try {
          const response = await authService.getCurrentUser();
          if (response?.data) {
            setUser(response.data);
            if (response.data.preferredLanguage) {
              setLanguage(response.data.preferredLanguage);
            }
          }
        } catch {
          authService.logout();
          setUser(null);
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const changeLanguage = (lang) => {
    setLanguage(lang);
    localStorage.setItem('gram_arogya_lang', lang);
  };

  /**
   * Simple dot-notation translation accessor
   * Example: t('nav.home') -> 'मुख्यपृष्ठ'
   */
  const t = (key) => {
    const keys = key.split('.');
    let current = translations[language] || translations.en;
    for (const k of keys) {
      if (current && current[k] !== undefined) {
        current = current[k];
      } else {
        // fallback to english
        let fallback = translations.en;
        for (const fbKey of keys) {
          fallback = fallback?.[fbKey];
        }
        return fallback || key;
      }
    }
    return current;
  };

  const login = async (credentials) => {
    const response = await authService.login(credentials);
    if (response?.data?.user) {
      setUser(response.data.user);
    }
    return response;
  };

  const register = async (userData) => {
    const response = await authService.register(userData);
    if (response?.data?.user) {
      setUser(response.data.user);
    }
    return response;
  };

  const logout = () => {
    authService.logout();
    setUser(null);
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
        isAuthenticated: !!user
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
