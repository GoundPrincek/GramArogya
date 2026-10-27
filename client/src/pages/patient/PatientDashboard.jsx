import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../hooks/useAuth';
import DashboardHeader from '../../components/dashboard/DashboardHeader';
import StatisticsCard from '../../components/dashboard/StatisticsCard';
import StatusBadge from '../../components/common/StatusBadge';
import Button from '../../components/common/Button';
import appointmentService from '../../services/appointmentService';
import referralService from '../../services/referralService';
import dashboardService from '../../services/dashboardService';
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
  const [dashboardStats, setDashboardStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      setLoading(true);
      const [dashRes, aptRes, refRes] = await Promise.allSettled([
        dashboardService.getPatientDashboard(),
        appointmentService.getMyAppointments(),
        referralService.getMyReferrals()
      ]);

      if (dashRes.status === 'fulfilled' && dashRes.value?.data?.stats) {
        setDashboardStats(dashRes.value.data.stats);
      }

      if (aptRes.status === 'fulfilled' && aptRes.value?.data) {
        const aptList = Array.isArray(aptRes.value.data) ? aptRes.value.data : (aptRes.value.data.appointments || []);
        setAppointments(aptList);
      } else {
        setAppointments(getStoredAppointments());
      }

      if (refRes.status === 'fulfilled' && refRes.value?.data) {
        const refList = Array.isArray(refRes.value.data) ? refRes.value.data : (refRes.value.data.referrals || []);
        setReferrals(refList);
      } else {
        setReferrals(getStoredReferrals());
      }
    } catch {
      setAppointments(getStoredAppointments());
      setReferrals(getStoredReferrals());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    window.addEventListener('gram_arogya_storage_changed', loadData);
    return () => window.removeEventListener('gram_arogya_storage_changed', loadData);
  }, []);

  const upcomingAppointments = appointments
    .filter((a) => {
      const st = (a.status || '').toLowerCase();
      return st === 'pending' || st === 'accepted' || st === 'scheduled';
    })
    .slice(0, 3);

  const activeReferrals = referrals
    .filter((r) => {
      const st = (r.status || '').toLowerCase();
      return st !== 'completed' && st !== 'rejected';
    })
    .slice(0, 3);

  const activeApptCount = dashboardStats?.pendingAppointments !== undefined
    ? (dashboardStats.pendingAppointments + (dashboardStats.acceptedAppointments || 0))
    : appointments.filter((a) => ['pending', 'accepted', 'scheduled'].includes((a.status || '').toLowerCase())).length;

  const pendingApptCount = dashboardStats?.pendingAppointments !== undefined
    ? dashboardStats.pendingAppointments
    : appointments.filter((a) => (a.status || '').toLowerCase() === 'pending').length;

  const activeRefCount = dashboardStats?.activeReferrals !== undefined
    ? dashboardStats.activeReferrals
    : activeReferrals.length;

  const unreadAlerts = dashboardStats?.unreadNotifications !== undefined
    ? dashboardStats.unreadNotifications
    : getStoredNotifications().filter((n) => !n.isRead).length;

  return (
    <div>
      <DashboardHeader
        title={`Citizen Health Console`}
        subtitle={`Welcome back, ${user?.name || 'Citizen'}. View your scheduled appointments and referral status across Maharashtra public health centers.`}
      />

      {/* Metrics Row */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '1rem',
        marginBottom: '2rem'
      }}>
        <StatisticsCard
          title="Active Appointment Requests"
          value={activeApptCount}
          icon={Calendar}
          change={`${pendingApptCount} Pending Facility Review`}
          trend="neutral"
        />

        <StatisticsCard
          title="Clinical Referrals"
          value={referrals.length}
          icon={Share2}
          change={`${activeRefCount} Active Inter-Facility Transfers`}
          trend="positive"
        />

        <StatisticsCard
          title="Unread Alerts"
          value={unreadAlerts}
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
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', margin: 'auto 0' }}>
              No upcoming appointments. Request an appointment at your nearby PHC or CHC.
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {upcomingAppointments.map((apt) => {
                const facilityTitle =
                  apt.facility?.name ||
                  apt.facilityId?.name ||
                  apt.facilityName ||
                  'Health Facility';
                const service = apt.requestedService || apt.department || 'General OPD';
                const token = apt.tokenNumber || 1;
                const aptDate = apt.preferredDate || apt.appointmentDate;
                const aptSlot = apt.preferredTime || apt.timeSlot;

                return (
                  <div
                    key={apt._id || apt.id}
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
                        {facilityTitle}
                      </strong>
                      <StatusBadge status={apt.status} />
                    </div>
                    <div style={{ fontSize: '0.825rem', color: 'var(--color-text-secondary)' }}>
                      {service} &bull; Token #{token}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <Clock size={13} /> {aptDate?.slice(0, 10)} ({aptSlot})
                    </div>
                  </div>
                );
              })}
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
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', margin: 'auto 0' }}>
              No active clinical transfers at this time.
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {activeReferrals.map((ref) => {
                const fromFacility =
                  ref.referringFacility?.name ||
                  ref.fromFacilityId?.name ||
                  ref.referringFacilityName ||
                  'Primary Health Center';
                const toFacility =
                  ref.receivingFacility?.name ||
                  ref.toFacilityId?.name ||
                  ref.receivingFacilityName ||
                  'Referral Center';
                const code = ref.referralCode || `REF-${(ref._id || '').slice(-6).toUpperCase()}`;

                return (
                  <div
                    key={ref._id || ref.id}
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
                        {code}
                      </span>
                      <StatusBadge status={ref.status} urgency={ref.urgencyLevel} />
                    </div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>
                      {fromFacility} &rarr; {toFacility}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>
                      Diagnosis: {ref.provisionalDiagnosis || 'Clinical Assessment'}
                    </div>
                  </div>
                );
              })}
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
