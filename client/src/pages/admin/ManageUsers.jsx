import React from 'react';
import DashboardHeader from '../../components/dashboard/DashboardHeader';

export const ManageUsers = () => {
  return (
    <div>
      <DashboardHeader
        title="Manage Platform Users"
        subtitle="Manage credentials, roles, and jurisdictions for medical officers and ASHA workers."
      />

      <div className="card">
        <p style={{ color: 'var(--color-text-secondary)' }}>
          User governance and role assignment table. Scheduled for implementation in Phase 3.
        </p>
      </div>
    </div>
  );
};

export default ManageUsers;
