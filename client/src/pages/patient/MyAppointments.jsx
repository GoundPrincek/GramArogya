import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DashboardHeader from '../../components/dashboard/DashboardHeader';
import AppointmentCard from '../../components/appointments/AppointmentCard';
import appointmentService from '../../services/appointmentService';
import Loader from '../../components/common/Loader';
import Modal from '../../components/common/Modal';
import Button from '../../components/common/Button';
import { Calendar, PlusCircle, AlertCircle, CheckCircle } from 'lucide-react';

export const MyAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [cancellingId, setCancellingId] = useState(null);
  const [cancelReason, setCancelReason] = useState('');
  const [submittingCancel, setSubmittingCancel] = useState(false);
  const [notification, setNotification] = useState(null);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const res = await appointmentService.getMyAppointments();
      const list = Array.isArray(res?.data) ? res.data : (res?.data?.appointments || []);
      setAppointments(list);
    } catch (err) {
      console.error('Failed to load appointments:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleOpenCancelModal = (id) => {
    setCancellingId(id);
    setCancelReason('');
  };

  const handleConfirmCancel = async () => {
    if (!cancellingId) return;
    try {
      setSubmittingCancel(true);
      await appointmentService.cancelAppointment(cancellingId, cancelReason || 'Cancelled by citizen');
      setNotification({ type: 'success', message: 'Appointment request cancelled successfully.' });
      setCancellingId(null);
      await fetchAppointments();
    } catch (err) {
      console.error('Failed to cancel appointment:', err);
      setNotification({
        type: 'error',
        message: err.response?.data?.message || 'Failed to cancel appointment. Please try again.'
      });
    } finally {
      setSubmittingCancel(false);
    }
  };

  const filtered = appointments.filter((apt) => {
    if (filter === 'all') return true;
    return (apt.status || '').toLowerCase() === filter.toLowerCase();
  });

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
        <DashboardHeader
          title="My Appointments"
          subtitle="View and manage scheduled outpatient consultations and visit tokens."
        />
        <Link to="/facilities" className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
          <PlusCircle size={16} /> Book New Appointment
        </Link>
      </div>

      {notification && (
        <div
          style={{
            padding: '0.75rem 1rem',
            borderRadius: 'var(--radius-md)',
            marginBottom: '1.25rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            backgroundColor: notification.type === 'success' ? 'var(--color-success-bg)' : '#fee2e2',
            color: notification.type === 'success' ? 'var(--color-success)' : '#dc2626',
            border: `1px solid ${notification.type === 'success' ? '#86efac' : '#fca5a5'}`
          }}
        >
          {notification.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
          <span>{notification.message}</span>
          <button
            type="button"
            onClick={() => setNotification(null)}
            style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', fontWeight: 'bold' }}
          >
            &times;
          </button>
        </div>
      )}

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        {[
          { label: 'All', value: 'all' },
          { label: 'Pending', value: 'pending' },
          { label: 'Accepted', value: 'accepted' },
          { label: 'Completed', value: 'completed' },
          { label: 'Cancelled', value: 'cancelled' }
        ].map((tab) => (
          <button
            key={tab.value}
            type="button"
            onClick={() => setFilter(tab.value)}
            className={`btn btn-sm ${filter === tab.value ? 'btn-primary' : 'btn-outline'}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <Loader message="Loading your appointment records..." />
      ) : filtered.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem 1.5rem' }}>
          <Calendar size={48} color="var(--color-text-muted)" style={{ margin: '0 auto 1rem' }} />
          <h3 style={{ fontSize: '1.15rem', color: 'var(--color-primary)', marginBottom: '0.5rem' }}>
            No Appointments Found
          </h3>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
            {filter === 'all'
              ? 'You have not scheduled any outpatient consultations yet.'
              : `No appointments with status "${filter}".`}
          </p>
          <Link to="/facilities" className="btn btn-primary">
            Browse Health Facilities
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {filtered.map((apt) => (
            <AppointmentCard
              key={apt._id || apt.id}
              appointment={apt}
              onCancel={handleOpenCancelModal}
            />
          ))}
        </div>
      )}

      {/* Cancel Confirmation Modal */}
      <Modal
        isOpen={!!cancellingId}
        onClose={() => setCancellingId(null)}
        title="Cancel Appointment Request"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', margin: 0 }}>
            Are you sure you want to cancel this outpatient appointment request? This will release your token number in the facility queue.
          </p>

          <div className="form-group">
            <label className="form-label">Reason for Cancellation (Optional)</label>
            <input
              type="text"
              placeholder="e.g. Schedule conflict, visit postponed"
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              className="form-input"
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
            <Button
              variant="secondary"
              onClick={() => setCancellingId(null)}
              disabled={submittingCancel}
            >
              Keep Appointment
            </Button>
            <Button
              variant="emergency"
              onClick={handleConfirmCancel}
              disabled={submittingCancel}
            >
              {submittingCancel ? 'Cancelling...' : 'Confirm Cancellation'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default MyAppointments;