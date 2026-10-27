import React from 'react';
import DashboardHeader from '../../components/dashboard/DashboardHeader';

export const ManageReferrals = () => {
  return (
    <div>
      <DashboardHeader
        title="Inter-Facility Referral Triage"
        subtitle="Review, accept, or transfer clinical patient cases to tertiary care centers."
      />

      <div className="card">
        <p style={{ color: 'var(--color-text-secondary)' }}>
          Clinical triage queue and ambulance tracking coordination view. Feature implementation scheduled for Phase 2.
        </p>
      </div>
    </div>
  );
};

export default ManageReferrals;
