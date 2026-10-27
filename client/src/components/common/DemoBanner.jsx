import React from 'react';
import { useTranslation } from 'react-i18next';
import { AlertCircle, RotateCcw } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export const DemoBanner = () => {
  const { t } = useTranslation();
  const { resetAllDemoData } = useAuth();

  return (
    <div className="demo-banner">
      <AlertCircle size={15} />
      <span>
        <strong>{t('app.demoBadge')}:</strong> {t('common.demoNotice')}
      </span>
      <button
        onClick={() => {
          if (window.confirm('Reset all demonstration data (appointments, facilities, referrals) to initial state?')) {
            resetAllDemoData();
          }
        }}
        style={{
          background: 'none',
          border: '1px solid #d97706',
          borderRadius: '4px',
          padding: '0.15rem 0.5rem',
          fontSize: '0.75rem',
          color: '#92400e',
          cursor: 'pointer',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.25rem',
          marginLeft: '0.5rem'
        }}
        title="Reset mock appointments, referrals, and facilities to default demonstration state"
      >
        <RotateCcw size={12} /> Reset Demo Data
      </button>
    </div>
  );
};

export default DemoBanner;
