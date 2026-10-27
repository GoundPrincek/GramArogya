import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { LANGUAGES } from '../../utils/constants';
import { Globe } from 'lucide-react';

export const LanguageSwitcher = () => {
  const { language, setLanguage } = useAuth();

  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
      <Globe size={16} style={{ color: 'var(--color-primary-light)' }} />
      <select
        value={language}
        onChange={(e) => setLanguage(e.target.value)}
        className="form-select"
        style={{
          padding: '0.3rem 0.6rem',
          fontSize: '0.85rem',
          borderRadius: 'var(--radius-sm)',
          cursor: 'pointer',
          border: '1px solid var(--color-border)',
          backgroundColor: '#ffffff'
        }}
        aria-label="Select platform language"
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
