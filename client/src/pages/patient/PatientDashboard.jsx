import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import DashboardHeader from '../../components/dashboard/DashboardHeader';
import StatisticsCard from '../../components/dashboard/StatisticsCard';
import Button from '../../components/common/Button';
import { Calendar, Share2, Activity, MapPin, ArrowRight } from 'lucide-react';

export const PatientDashboard = () => {
  const { user } = useAuth();

  return (
    <div>
      <DashboardHeader
        title="Citizen Health Dashboard"
        subtitle={`Welcome, ${user?.name || 'Citizen'}. Manage your rural healthcare consultations.`}
      />

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3" style={{ marginBottom: '2rem' }}>
        <StatisticsCard
          title="Upcoming Appointments"
          value="1"
          icon={Calendar}
          change="Wagholi PHC - Tomorrow 10:00 AM"
          trend="positive"
        />
        <StatisticsCard
          title="Active Referrals"
          value="1"
          icon={Share2}
          change="To Aundh District Hospital"
          trend="neutral"
        />
        <StatisticsCard
          title="Assigned PHC"
          value="Wagholi"
          icon={Activity}
          change="Haveli Taluka, Pune"
          trend="positive"
        />
      </div>

      {/* Quick Action Grid */}
      <div className="grid sm:grid-cols-2" style={{ gap: '1.5rem' }}>
        <div className="card">
          <h3 style={{ fontSize: '1.2rem', color: 'var(--color-primary)', marginBottom: '0.75rem' }}>
            Book Outpatient Consultation
          </h3>
          <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', marginBottom: '1.25rem' }}>
            Schedule an OPD visit at your nearby Primary Health Centre or Community Health Centre.
          </p>
          <Link to="/facilities">
            <Button variant="primary">
              <Calendar size={16} /> Find Health Centre & Book
            </Button>
          </Link>
        </div>

        <div className="card">
          <h3 style={{ fontSize: '1.2rem', color: 'var(--color-primary)', marginBottom: '0.75rem' }}>
            My Clinical Transfers
          </h3>
          <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', marginBottom: '1.25rem' }}>
            Check status of doctor-initiated referrals from your village PHC to tertiary hospitals.
          </p>
          <Link to="/patient/referrals">
            <Button variant="secondary">
              Track Referral <ArrowRight size={16} />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;
