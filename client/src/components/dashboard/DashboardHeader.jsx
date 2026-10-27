import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import LanguageSwitcher from '../common/LanguageSwitcher';
import { Bell, User } from 'lucide-react';

export const DashboardHeader = ({ title, subtitle }) => {
  const { user } = useAuth();

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingBottom: '1.5rem',
      marginBottom: '1.5rem',
      borderBottom: '1px solid var(--color-border)',
      flexWrap: 'wrap',
      gap: '1rem'
    }}>
      <div>
        <h1 style={{ fontSize: '1.65rem', color: 'var(--color-primary)', margin: 0 }}>
          {title}
        </h1>
        {subtitle && (
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
            {subtitle}
          </p>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <LanguageSwitcher />

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.6rem',
          padding: '0.35rem 0.75rem',
          backgroundColor: '#ffffff',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-full)'
        }}>
          <div style={{
            width: '28px',
            height: '28px',
            borderRadius: '50%',
            backgroundColor: 'var(--color-primary)',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '0.8rem',
            fontWeight: 700
          }}>
            {user?.name ? user.name[0].toUpperCase() : 'U'}
          </div>
          <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{user?.name}</span>
          <span className="badge badge-info" style={{ fontSize: '0.65rem', padding: '0.15rem 0.4rem' }}>
            {user?.role}
          </span>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
