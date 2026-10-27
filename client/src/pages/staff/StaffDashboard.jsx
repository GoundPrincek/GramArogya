import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DashboardHeader from '../../components/dashboard/DashboardHeader';
import StatisticsCard from '../../components/dashboard/StatisticsCard';
import StatusBadge from '../../components/common/StatusBadge';
import Loader from '../../components/common/Loader';
import dashboardService from '../../services/dashboardService';
import { useAuth } from '../../hooks/useAuth';
import {
  Users,
  Calendar,
  Share2,
  CheckCircle2,
  Clock,
  ArrowRight,
  Building,
  AlertCircle
} from 'lucide-react';

export const StaffDashboard = () => {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStaffDashboard = async () => {
      try {
        setLoading(true);
        const res = await dashboardService.getStaffDashboard();
        if (res?.data) {
          setData(res.data);
        }
      } catch (err) {
        console.error('Failed to load staff dashboard:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStaffDashboard();
  }, []);

  if (loading) return <Loader message="Loading medical officer console..." />;

  const stats = data?.stats || {
    totalRequests: 0,
    pendingRequests: 0,
    acceptedRequests: 0,
    completedToday: 0,
    incomingReferrals: 0,
    outgoingReferrals: 0
  };

  const facility = data?.facility || user?.facilityId;
  const recentAppointments = data?.recentAppointments || [];

  return (
    <div>
      <DashboardHeader
        title="Medical Officer & Staff Console"
        subtitle={`Operational triage queue, outpatient management, and inter-facility referrals for ${facility?.name || 'Assigned Health Facility'}.`}
      />

      {facility && (
        <div style={{
          backgroundColor: 'var(--color-bg-main)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-md)',
          padding: '0.85rem 1.25rem',
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem'
        }}>
          <Building size={20} color="var(--color-primary)" />
          <div>
            <strong style={{ color: 'var(--color-primary)', fontSize: '0.95rem' }}>
              {facility.name} ({facility.facilityType || facility.tier})
            </strong>
            <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>
              Jurisdiction: {facility.taluka}, {facility.district} District
            </div>
          </div>
        </div>
      )}

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4" style={{ marginBottom: '2rem' }}>
        <StatisticsCard
          title="Pending Queue Triage"
          value={stats.pendingRequests}
          icon={Clock}
          change="Awaiting Staff Action"
          trend="neutral"
        />
        <StatisticsCard
          title="Accepted Outpatients"
          value={stats.acceptedRequests}
          icon={Calendar}
          change="Scheduled Consultations"
          trend="positive"
        />
        <StatisticsCard
          title="Incoming Transfers"
          value={stats.incomingReferrals}
          icon={Share2}
          change="Active Care Referrals"
          trend="neutral"
        />
        <StatisticsCard
          title="Completed Today"
          value={stats.completedToday}
          icon={CheckCircle2}
          change="Consultations Closed"
          trend="positive"
        />
      </div>

      {/* Quick Action Navigation */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '1rem',
        marginBottom: '2rem'
      }}>
        <Link
          to="/staff/appointments"
          className="card card-interactive"
          style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
        >
          <div>
            <h4 style={{ margin: 0, color: 'var(--color-primary)', fontSize: '1.05rem' }}>
              Outpatient Triage Queue &rarr;
            </h4>
            <p style={{ margin: '0.25rem 0 0', fontSize: '0.825rem', color: 'var(--color-text-secondary)' }}>
              Review, accept, or reject incoming patient consultation requests.
            </p>
          </div>
          <Calendar size={28} color="var(--color-primary)" />
        </Link>

        <Link
          to="/staff/referrals"
          className="card card-interactive"
          style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
        >
          <div>
            <h4 style={{ margin: 0, color: 'var(--color-primary)', fontSize: '1.05rem' }}>
              Referral Coordination &rarr;
            </h4>
            <p style={{ margin: '0.25rem 0 0', fontSize: '0.825rem', color: 'var(--color-text-secondary)' }}>
              Manage inter-facility transfers, transfer acceptance, and bed readiness.
            </p>
          </div>
          <Share2 size={28} color="var(--color-secondary)" />
        </Link>
      </div>

      {/* Recent Appointments Preview */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h3 style={{ fontSize: '1.15rem', color: 'var(--color-primary)', margin: 0 }}>
            Recent Consultation Requests
          </h3>
          <Link to="/staff/appointments" style={{ fontSize: '0.85rem', color: 'var(--color-secondary)', fontWeight: 600 }}>
            View Full Queue ({stats.totalRequests})
          </Link>
        </div>

        {recentAppointments.length === 0 ? (
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', margin: '1rem 0' }}>
            No recent consultation requests recorded for this healthcare facility.
          </p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="table" style={{ width: '100%', fontSize: '0.875rem' }}>
              <thead>
                <tr>
                  <th>Token #</th>
                  <th>Patient</th>
                  <th>Service</th>
                  <th>Preferred Date & Time</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentAppointments.map((apt) => (
                  <tr key={apt._id || apt.id}>
                    <td>
                      <span className="badge badge-routine">#{apt.tokenNumber || 1}</span>
                    </td>
                    <td>
                      <strong>{apt.patient?.name || apt.patientName || 'Citizen Patient'}</strong>
                      {apt.patient?.phone && (
                        <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                          {apt.patient.phone}
                        </div>
                      )}
                    </td>
                    <td>{apt.requestedService || apt.department}</td>
                    <td>
                      {(apt.preferredDate || apt.appointmentDate)?.slice(0, 10)}
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                        {apt.preferredTime || apt.timeSlot}
                      </div>
                    </td>
                    <td>
                      <StatusBadge status={apt.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default StaffDashboard;