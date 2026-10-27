import React from 'react';

export const ReferralStatus = ({ status, urgency }) => {
  const normStatus = (status || 'created').toLowerCase().replace(' ', '_');

  const getStatusBadge = () => {
    switch (normStatus) {
      case 'accepted':
      case 'completed':
        return 'badge-accepted';
      case 'sent':
      case 'enroute':
      case 'in_progress':
        return 'badge-pending';
      case 'created':
      case 'pending':
        return 'badge-routine';
      case 'rejected':
      case 'cancelled':
        return 'badge-emergency';
      default:
        return 'badge-info';
    }
  };

  const getUrgencyBadge = () => {
    const normUrgency = (urgency || 'routine').toLowerCase();
    switch (normUrgency) {
      case 'emergency':
        return <span className="badge badge-emergency">EMERGENCY</span>;
      case 'urgent':
        return <span className="badge badge-warning">URGENT</span>;
      default:
        return <span className="badge badge-routine">ROUTINE</span>;
    }
  };

  const formattedStatus = normStatus.split('_').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

  return (
    <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
      {urgency && getUrgencyBadge()}
      <span className={`badge ${getStatusBadge()}`}>{formattedStatus}</span>
    </div>
  );
};

export default ReferralStatus;
