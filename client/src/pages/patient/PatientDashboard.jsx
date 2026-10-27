import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../hooks/useAuth';
import DashboardHeader from '../../components/dashboard/DashboardHeader';
import StatisticsCard from '../../components/dashboard/StatisticsCard';
import StatusBadge from '../../components/common/StatusBadge';
import Button from '../../components/common/Button';
import {
  getStoredAppointments,
  getStoredReferrals,
  getStoredNotifications
} from '../../services/storageService';
import {
  Calendar,
  Share2,
  Bell,
  MapPin,
  ArrowRight,
  Clock,
  HeartPulse,
  Info,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export const PatientDashboard = () => {
  const { t } = useTranslation();
  const { user } = useAuth();

  const [appointments, setAppointments] = useState([]);
  const [referrals, setReferrals] = useState([]);
  const [notifications, setNotifications] = useState([]);

  const loadData = () => {
    setAppointments(getStoredAppointments());
    setReferrals(getStoredReferrals());
    setNotifications(getStoredNotifications());
  };

  useEffect(() => {
    loadData();
    window.addEventListener('gram_arogya_storage_changed', loadData);
    return () => window.removeEventListener('gram_arogya_storage_changed', loadData);
  }, []);

  const upcomingAppointments = appointments
    .filter((a) => a.status === 'Pending' || a.status === 'Accepted')
    .slice(0, 2);

  const activeReferrals = referrals
    .filter((r) => r.status !== 'Completed' && r.status !== 'Rejected')
    .slice(0, 2);

  const unreadNotifications = notifications.filter((n) => !n.isRead).length;

  return (
    <div>
      <DashboardHeader
        title={`Citizen Health Console`}
        subtitle={`Welcome back, ${user?.name || 'Citizen'}. View your scheduled appointments and referral status across Maharashtra public health centers.`}
      />

      {/* Demonstration Notice Box */}
      <div className="notice-box-warning" style={{ marginBottom: '1.5rem', fontSize: '0.85rem' }}>
        <Info size={18} style={{ flexShrink: 0 }} />
        <div>
          <strong>Demonstration Workspace:</strong> All records below represent local prototype state. In Phase 2, this portal will sync with your verified ABHA / Ayushman Bharat digital health ID.
        </div>
      </div>

      {/* Metrics Row */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '1rem',
        marginBottom: '2rem'
      }}>
        <StatisticsCard
          title="Active Appointment Requests"
          value={appointments.filter((a) => a.status === 'Pending' || a.status === 'Accepted').length}
          icon={Calendar}
          change={`${appointments.filter((a) => a.status === 'Pending').length} Pending Facility Review`}
          trend="neutral"
        />

        <StatisticsCard
          title="Clinical Referrals"
          value={referrals.length}
          icon={Share2}
          change={`${activeReferrals.length} Active Inter-Facility Transfers`}
          trend="positive"
        />

        <StatisticsCard
          title="Unread Alerts"
          value={unreadNotifications}
          icon={Bell}
          change="Public Health Updates"
          trend="neutral"
        />

        <StatisticsCard
          title="Assigned Taluka"
          value={user?.jurisdiction?.taluka || 'Haveli'}
          icon={MapPin}
          change={`${user?.jurisdiction?.district || 'Pune'} District`}
          trend="positive"
        />
      </div>

      {/* Two Column Layout: Upcoming Consultations & Referral Status */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '1.5rem',
        marginBottom: '2rem'
      }}>
        {/* Card 1: Upcoming Appointments */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.15rem', color: 'var(--color-primary)', margin: 0 }}>
              Upcoming Consultations
            </h3>
            <Link to="/patient/appointments" style={{ fontSize: '0.825rem', color: 'var(--color-secondary)', fontWeight: 600 }}>
              View All ({appointments.length})
            </Link>
          </div>

          {upcomingAppointments.length === 0 ? (
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', margin: 'auto 0' }}>
              No upcoming appointments. Request an appointment at your nearby PHC or CHC.
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {upcomingAppointments.map((apt) => (
                <div
                  key={apt._id}
                  style={{
                    padding: '0.75rem',
                    backgroundColor: 'var(--color-bg-main)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--color-border)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.35rem'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <strong style={{ fontSize: '0.925rem', color: 'var(--color-primary)' }}>
                      {apt.facilityName}
                    </strong>
                    <StatusBadge status={apt.status} />
                  </div>
                  <div style={{ fontSize: '0.825rem', color: 'var(--color-text-secondary)' }}>
                    {apt.requestedService} &bull; Token #{apt.tokenNumber}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <Clock size={13} /> {apt.appointmentDate} ({apt.timeSlot})
                  </div>
                </div>
              ))}
            </div>
          )}

          <div style={{ marginTop: 'auto', paddingTop: '1rem' }}>
            <Link to="/facilities" className="btn btn-outline btn-sm" style={{ width: '100%' }}>
              <Calendar size={14} /> Request New Appointment
            </Link>
          </div>
        </div>

        {/* Card 2: Active Referrals */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.15rem', color: 'var(--color-primary)', margin: 0 }}>
              Clinical Referral Tracking
            </h3>
            <Link to="/patient/referrals" style={{ fontSize: '0.825rem', color: 'var(--color-secondary)', fontWeight: 600 }}>
              View All ({referrals.length})
            </Link>
          </div>

          {activeReferrals.length === 0 ? (
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', margin: 'auto 0' }}>
              No active clinical transfers at this time.
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {activeReferrals.map((ref) => (
                <div
                  key={ref._id}
                  style={{
                    padding: '0.75rem',
                    backgroundColor: 'var(--color-bg-main)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--color-border)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.35rem'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
                      {ref.referralCode}
                    </span>
                    <StatusBadge status={ref.status} urgency={ref.urgencyLevel} />
                  </div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>
                    {ref.referringFacilityName} &rarr; {ref.receivingFacilityName}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>
                    Diagnosis: {ref.provisionalDiagnosis}
                  </div>
                </div>
              ))}
            </div>
          )}

          <div style={{ marginTop: 'auto', paddingTop: '1rem' }}>
            <Link to="/patient/referrals" className="btn btn-secondary btn-sm" style={{ width: '100%' }}>
              <Share2 size={14} /> View Referral Timeline & Handoffs
            </Link>
          </div>
        </div>
      </div>

      {/* Helpful Healthcare Access Advice */}
      <div className="card" style={{ backgroundColor: '#ffffff' }}>
        <h3 style={{ fontSize: '1.15rem', color: 'var(--color-primary)', marginBottom: '0.75rem' }}>
          Rural Healthcare Access Tips
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem', fontSize: '0.875rem', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
            <CheckCircle2 size={18} color="var(--color-success)" style={{ flexShrink: 0, marginTop: '2px' }} />
            <span>Carry previous medical prescriptions and government identity proof when reporting for your OPD token.</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
            <CheckCircle2 size={18} color="var(--color-success)" style={{ flexShrink: 0, marginTop: '2px' }} />
            <span>For maternal care, connect with your village ASHA worker who can facilitate coordinated transport via Helpline 102.</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
            <CheckCircle2 size={18} color="var(--color-success)" style={{ flexShrink: 0, marginTop: '2px' }} />
            <span>Essential medicines listed under the Maharashtra National Health Mission formulary are dispensed free of charge at all PHCs.</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;
