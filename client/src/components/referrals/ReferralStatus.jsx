import React from 'react';

export const ReferralStatus = ({ status, urgency }) => {
  const getStatusBadge = () => {
    switch (status) {
      case 'Accepted':
      case 'Completed':
        return 'badge-success';
      case 'EnRoute':
      case 'Arrived':
        return 'badge-info';
      case 'Pending':
        return 'badge-warning';
      case 'Rejected':
        return 'badge-emergency';
      default:
        return 'badge-info';
    }
  };

  const getUrgencyBadge = () => {
    switch (urgency) {
      case 'Emergency':
        return <span className="badge badge-emergency">EMERGENCY</span>;
      case 'Urgent':
        return <span className="badge badge-warning">URGENT</span>;
      default:
        return <span className="badge badge-info">ROUTINE</span>;
    }
  };

  return (
    <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
      {urgency && getUrgencyBadge()}
      <span className={`badge ${getStatusBadge()}`}>{status}</span>
    </div>
  );
};

export default ReferralStatus;
