import React from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../hooks/useAuth';
import { LANGUAGES } from '../../utils/constants';
import { Globe } from 'lucide-react';

export const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const { language, setLanguage } = useAuth();

  const handleSelect = (e) => {
    const selected = e.target.value;
    setLanguage(selected);
    i18n.changeLanguage(selected);
  };

  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
      <Globe size={16} style={{ color: 'var(--color-primary-light)' }} />
      <select
        value={language || i18n.language}
        onChange={handleSelect}
        className="form-select"
        style={{
          padding: '0.35rem 0.65rem',
          fontSize: '0.85rem',
          borderRadius: 'var(--radius-sm)',
          cursor: 'pointer',
          border: '1px solid var(--color-border)',
          backgroundColor: '#ffffff',
          fontWeight: 500
        }}
        aria-label="Select Interface Language"
      >
        {LANGUAGES.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default LanguageSwitcher;
