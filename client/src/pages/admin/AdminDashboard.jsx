import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DashboardHeader from '../../components/dashboard/DashboardHeader';
import StatisticsCard from '../../components/dashboard/StatisticsCard';
import Loader from '../../components/common/Loader';
import dashboardService from '../../services/dashboardService';
import {
  Building,
  Users,
  Calendar,
  Share2,
  BarChart3,
  ShieldCheck,
  ArrowRight,
  Activity
} from 'lucide-react';

export const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminDashboard = async () => {
      try {
        setLoading(true);
        const res = await dashboardService.getAdminDashboard();
        if (res?.data) {
          setData(res.data);
        }
      } catch (err) {
        console.error('Failed to load admin dashboard:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminDashboard();
  }, []);

  if (loading) return <Loader message="Loading district administration dashboard..." />;

  const stats = data?.stats || {
    totalFacilities: 0,
    activeFacilities: 0,
    totalUsers: 0,
    totalPatients: 0,
    totalStaff: 0,
    totalAppointments: 0,
    pendingAppointments: 0,
    totalReferrals: 0,
    activeReferrals: 0
  };

  const facilitiesByTier = data?.breakdowns?.facilitiesByTier || {};
  const appointmentsByStatus = data?.breakdowns?.appointmentsByStatus || {};

  return (
    <div>
      <DashboardHeader
        title="District Health Administration"
        subtitle="Government of Maharashtra public healthcare access governance and system surveillance."
      />

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4" style={{ marginBottom: '2rem' }}>
        <StatisticsCard
          title="Healthcare Facilities"
          value={stats.totalFacilities}
          icon={Building}
          change={`${stats.activeFacilities} Active in Registry`}
          trend="positive"
        />
        <StatisticsCard
          title="Registered Users"
          value={stats.totalUsers}
          icon={Users}
          change={`${stats.totalStaff} Staff / ${stats.totalPatients} Citizens`}
          trend="positive"
        />
        <StatisticsCard
          title="Total Consultations"
          value={stats.totalAppointments}
          icon={Calendar}
          change={`${stats.pendingAppointments} In Triage Queue`}
          trend="neutral"
        />
        <StatisticsCard
          title="Clinical Referrals"
          value={stats.totalReferrals}
          icon={Share2}
          change={`${stats.activeReferrals} Active Handoffs`}
          trend="positive"
        />
      </div>

      {/* Quick Governance Links */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '1rem',
        marginBottom: '2rem'
      }}>
        <Link
          to="/admin/facilities"
          className="card card-interactive"
          style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
        >
          <div>
            <h4 style={{ margin: 0, color: 'var(--color-primary)', fontSize: '1.05rem' }}>
              Facility Registry Management &rarr;
            </h4>
            <p style={{ margin: '0.25rem 0 0', fontSize: '0.825rem', color: 'var(--color-text-secondary)' }}>
              Onboard new PHCs/CHCs, update operational hours, and manage service tiers.
            </p>
          </div>
          <Building size={28} color="var(--color-primary)" />
        </Link>

        <Link
          to="/admin/users"
          className="card card-interactive"
          style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
        >
          <div>
            <h4 style={{ margin: 0, color: 'var(--color-primary)', fontSize: '1.05rem' }}>
              User Governance & Roles &rarr;
            </h4>
            <p style={{ margin: '0.25rem 0 0', fontSize: '0.825rem', color: 'var(--color-text-secondary)' }}>
              Assign role privileges, jurisdiction districts, and facility affiliations.
            </p>
          </div>
          <Users size={28} color="var(--color-secondary)" />
        </Link>

        <Link
          to="/admin/analytics"
          className="card card-interactive"
          style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
        >
          <div>
            <h4 style={{ margin: 0, color: 'var(--color-primary)', fontSize: '1.05rem' }}>
              Surveillance & Analytics &rarr;
            </h4>
            <p style={{ margin: '0.25rem 0 0', fontSize: '0.825rem', color: 'var(--color-text-secondary)' }}>
              Monitor referral efficiency, service delivery volumes, and tier load.
            </p>
          </div>
          <BarChart3 size={28} color="var(--color-primary-light)" />
        </Link>
      </div>

      {/* Two Column Breakdown Overview */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '1.5rem'
      }}>
        {/* Card 1: Facility Breakdown */}
        <div className="card">
          <h3 style={{ fontSize: '1.15rem', color: 'var(--color-primary)', marginBottom: '1rem' }}>
            Facility Network Distribution
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {[
              { label: 'Primary Health Centres (PHC)', key: 'PHC', badge: 'badge-accepted' },
              { label: 'Community Health Centres (CHC)', key: 'CHC', badge: 'badge-warning' },
              { label: 'Sub-District Hospitals (SDH)', key: 'SubDistrictHospital', badge: 'badge-warning' },
              { label: 'District Hospitals (DH)', key: 'DistrictHospital', badge: 'badge-emergency' },
              { label: 'Sub-Centres', key: 'SubCenter', badge: 'badge-routine' }
            ].map((tier) => {
              const count = facilitiesByTier[tier.key] || 0;
              return (
                <div
                  key={tier.key}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '0.5rem 0.75rem',
                    backgroundColor: 'var(--color-bg-main)',
                    borderRadius: 'var(--radius-sm)'
                  }}
                >
                  <span style={{ fontSize: '0.875rem' }}>{tier.label}</span>
                  <span className={`badge ${tier.badge}`}>{count}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Card 2: Consultation Queue Breakdown */}
        <div className="card">
          <h3 style={{ fontSize: '1.15rem', color: 'var(--color-primary)', marginBottom: '1rem' }}>
            Appointment Status Pipeline
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {[
              { label: 'Pending Review', key: 'pending', badge: 'badge-pending' },
              { label: 'Accepted / Scheduled', key: 'accepted', badge: 'badge-accepted' },
              { label: 'Consultations Completed', key: 'completed', badge: 'badge-routine' },
              { label: 'Rejected / Declined', key: 'rejected', badge: 'badge-emergency' },
              { label: 'Citizen Cancelled', key: 'cancelled', badge: 'badge-emergency' }
            ].map((st) => {
              const count = appointmentsByStatus[st.key] || 0;
              return (
                <div
                  key={st.key}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '0.5rem 0.75rem',
                    backgroundColor: 'var(--color-bg-main)',
                    borderRadius: 'var(--radius-sm)'
                  }}
                >
                  <span style={{ fontSize: '0.875rem' }}>{st.label}</span>
                  <span className={`badge ${st.badge}`}>{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;