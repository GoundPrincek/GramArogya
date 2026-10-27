import React from 'react';
import DashboardHeader from '../../components/dashboard/DashboardHeader';

export const ManageAppointments = () => {
  return (
    <div>
      <DashboardHeader
        title="Manage Facility Appointments"
        subtitle="Manage the daily OPD consultation queue and patient check-ins."
      />

      <div className="card">
        <p style={{ color: 'var(--color-text-secondary)' }}>
          Queue management interface for clinical officers and reception staff. Feature implementation scheduled for Phase 2.
        </p>
      </div>
    </div>
  );
};

export default ManageAppointments;
