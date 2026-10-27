import React from 'react';
import DashboardHeader from '../../components/dashboard/DashboardHeader';

export const Analytics = () => {
  return (
    <div>
      <DashboardHeader
        title="District Health Analytics"
        subtitle="Epidemiological trends, referral turnaround metrics, and OPD queue statistics."
      />

      <div className="card">
        <p style={{ color: 'var(--color-text-secondary)' }}>
          Public health surveillance graphs and taluka-level health outcome metrics. Scheduled for implementation in Phase 3.
        </p>
      </div>
    </div>
  );
};

export default Analytics;
