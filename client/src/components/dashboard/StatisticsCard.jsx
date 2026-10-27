import React from 'react';

export const StatisticsCard = ({ title, value, icon: Icon, change, trend = 'neutral' }) => {
  return (
    <div className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <div>
        <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', display: 'block', marginBottom: '0.25rem' }}>
          {title}
        </span>
        <span style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--color-text-primary)' }}>
          {value}
        </span>
        {change && (
          <span style={{
            fontSize: '0.75rem',
            display: 'block',
            marginTop: '0.25rem',
            color: trend === 'positive' ? 'var(--color-success)' : trend === 'negative' ? 'var(--color-emergency)' : 'var(--color-text-muted)'
          }}>
            {change}
          </span>
        )}
      </div>

      {Icon && (
        <div style={{
          backgroundColor: 'var(--color-accent-subtle)',
          color: 'var(--color-primary)',
          padding: '0.75rem',
          borderRadius: 'var(--radius-md)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Icon size={24} />
        </div>
      )}
    </div>
  );
};

export default StatisticsCard;
