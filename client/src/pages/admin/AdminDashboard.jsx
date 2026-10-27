import React from 'react';
import DashboardHeader from '../../components/dashboard/DashboardHeader';
import StatisticsCard from '../../components/dashboard/StatisticsCard';
import { Building, Users, Calendar, BarChart3 } from 'lucide-react';

export const AdminDashboard = () => {
  return (
    <div>
      <DashboardHeader
        title="District Health Administration"
        subtitle="Maharashtra public healthcare platform overview and governance."
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4" style={{ marginBottom: '2rem' }}>
        <StatisticsCard
          title="Total Registered Facilities"
          value="4"
          icon={Building}
          change="36 Districts Covered"
          trend="positive"
        />
        <StatisticsCard
          title="Active Healthcare Users"
          value="1,240"
          icon={Users}
          change="+18% this month"
          trend="positive"
        />
        <StatisticsCard
          title="Total Consultations"
          value="8,450"
          icon={Calendar}
          change="Across all PHCs/CHCs"
          trend="positive"
        />
        <StatisticsCard
          title="Referral Completion Rate"
          value="94.2%"
          icon={BarChart3}
          change="Average transfer: 42 mins"
          trend="positive"
        />
      </div>

      <div className="card">
        <h3 style={{ fontSize: '1.2rem', color: 'var(--color-primary)', marginBottom: '0.75rem' }}>
          District Administration Overview
        </h3>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>
          Health facility onboarding, credential verification, and population health surveillance modules scheduled for Phase 3.
        </p>
      </div>
    </div>
  );
};

export default AdminDashboard;
