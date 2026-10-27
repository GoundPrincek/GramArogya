import React from 'react';

export const AppointmentStatus = ({ status }) => {
  const normStatus = (status || 'pending').toLowerCase();

  const getBadgeClass = () => {
    switch (normStatus) {
      case 'accepted':
      case 'confirmed':
        return 'badge-accepted';
      case 'pending':
      case 'scheduled':
        return 'badge-pending';
      case 'completed':
        return 'badge-routine';
      case 'rejected':
      case 'cancelled':
      case 'noshow':
        return 'badge-emergency';
      default:
        return 'badge-info';
    }
  };

  const formattedStatus = normStatus.charAt(0).toUpperCase() + normStatus.slice(1);

  return (
    <span className={`badge ${getBadgeClass()}`}>
      {formattedStatus}
    </span>
  );
};

export default AppointmentStatus;
