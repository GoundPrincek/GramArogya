import React from 'react';
import DashboardHeader from '../../components/dashboard/DashboardHeader';
import StatisticsCard from '../../components/dashboard/StatisticsCard';
import { Users, Calendar, Share2, AlertTriangle } from 'lucide-react';

export const StaffDashboard = () => {
  return (
    <div>
      <DashboardHeader
        title="Medical Officer & Staff Console"
        subtitle="Operational triage queue, outpatient management, and inter-facility referrals."
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4" style={{ marginBottom: '2rem' }}>
        <StatisticsCard
          title="Today's OPD Queue"
          value="28"
          icon={Calendar}
          change="8 Completed, 20 Waiting"
          trend="positive"
        />
        <StatisticsCard
          title="Incoming Transfers"
          value="4"
          icon={Share2}
          change="2 Emergency, 2 Routine"
          trend="negative"
        />
        <StatisticsCard
          title="Active Doctors On Duty"
          value="3"
          icon={Users}
          change="General, Pediatrics, OB/GYN"
          trend="neutral"
        />
        <StatisticsCard
          title="Emergency Flags"
          value="1"
          icon={AlertTriangle}
          change="Requires Bed Allocation"
          trend="negative"
        />
      </div>

      <div className="card">
        <h3 style={{ fontSize: '1.2rem', color: 'var(--color-primary)', marginBottom: '1rem' }}>
          Daily Outpatient Triage Status
        </h3>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>
          Full medical triage and patient consultation logging workflow will be activated in Phase 2.
        </p>
      </div>
    </div>
  );
};

export default StaffDashboard;
