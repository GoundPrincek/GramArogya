import React from 'react';
import DashboardHeader from '../../components/dashboard/DashboardHeader';

export const ManageFacilities = () => {
  return (
    <div>
      <DashboardHeader
        title="Manage Public Healthcare Registry"
        subtitle="Register and maintain Primary Health Centres, Sub-Centres, and Hospital networks."
      />

      <div className="card">
        <p style={{ color: 'var(--color-text-secondary)' }}>
          Public health facility registry, tier assignments, and emergency readiness controls. Scheduled for implementation in Phase 3.
        </p>
      </div>
    </div>
  );
};

export default ManageFacilities;
