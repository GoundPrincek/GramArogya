import React from 'react';

export const AppointmentStatus = ({ status }) => {
  const getBadgeClass = () => {
    switch (status) {
      case 'Confirmed':
        return 'badge-success';
      case 'Scheduled':
        return 'badge-info';
      case 'Completed':
        return 'badge-primary';
      case 'Cancelled':
      case 'NoShow':
        return 'badge-emergency';
      default:
        return 'badge-info';
    }
  };

  return (
    <span className={`badge ${getBadgeClass()}`}>
      {status}
    </span>
  );
};

export default AppointmentStatus;
