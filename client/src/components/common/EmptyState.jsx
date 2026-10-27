import React from 'react';
import Button from './Button';
import { Inbox } from 'lucide-react';

export const EmptyState = ({
  icon: Icon = Inbox,
  title = 'No Records Found',
  description = 'There are currently no items to display matching your criteria.',
  actionText,
  onAction
}) => {
  return (
    <div style={{
      textAlign: 'center',
      padding: '3rem 1.5rem',
      backgroundColor: '#ffffff',
      borderRadius: 'var(--radius-lg)',
      border: '1px dashed var(--color-border)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.75rem',
      margin: '1rem 0'
    }}>
      <div style={{
        width: '56px',
        height: '56px',
        borderRadius: '50%',
        backgroundColor: 'var(--color-bg-main)',
        color: 'var(--color-text-muted)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <Icon size={28} />
      </div>
      <h3 style={{ fontSize: '1.15rem', color: 'var(--color-primary)', margin: 0 }}>
        {title}
      </h3>
      <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', maxWidth: '420px', margin: 0 }}>
        {description}
      </p>
      {actionText && onAction && (
        <div style={{ marginTop: '0.5rem' }}>
          <Button variant="secondary" onClick={onAction}>
            {actionText}
          </Button>
        </div>
      )}
    </div>
  );
};

export default EmptyState;
