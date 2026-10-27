import React, { useState, useEffect } from 'react';
import DashboardHeader from '../../components/dashboard/DashboardHeader';
import StatusBadge from '../../components/common/StatusBadge';
import Loader from '../../components/common/Loader';
import Modal from '../../components/common/Modal';
import Button from '../../components/common/Button';
import appointmentService from '../../services/appointmentService';
import { useAuth } from '../../hooks/useAuth';
import {
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  FileText,
  User,
  Search
} from 'lucide-react';

export const ManageAppointments = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('pending');
  const [search, setSearch] = useState('');

  // Modals state
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [decisionReason, setDecisionReason] = useState('');
  const [completeModalOpen, setCompleteModalOpen] = useState(false);
  const [consultationNotes, setConsultationNotes] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const facilityId = user?.facilityId?._id || user?.facilityId;
      const res = await appointmentService.getFacilityAppointments(facilityId);
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
  }, [user]);

  const handleAccept = async (id) => {
    try {
      setActionLoading(true);
      await appointmentService.updateAppointmentStatus(id, 'accepted', 'Request accepted by triage officer');
      setNotification({ type: 'success', message: 'Appointment accepted and patient token confirmed.' });
      await fetchAppointments();
    } catch (err) {
      console.error('Failed to accept appointment:', err);
      setNotification({
        type: 'error',
        message: err.response?.data?.message || 'Failed to accept appointment request.'
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleOpenRejectModal = (apt) => {
    setSelectedAppointment(apt);
    setDecisionReason('');
    setRejectModalOpen(true);
  };

  const handleConfirmReject = async () => {
    if (!selectedAppointment) return;
    if (!decisionReason.trim() || decisionReason.trim().length < 3) {
      alert('Please provide a reason of at least 3 characters explaining why this request cannot be fulfilled.');
      return;
    }

    try {
      setActionLoading(true);
      await appointmentService.updateAppointmentStatus(
        selectedAppointment._id || selectedAppointment.id,
        'rejected',
        '',
        decisionReason
      );
      setNotification({ type: 'success', message: 'Appointment request rejected with provided explanation.' });
      setRejectModalOpen(false);
      setSelectedAppointment(null);
      await fetchAppointments();
    } catch (err) {
      console.error('Failed to reject appointment:', err);
      setNotification({
        type: 'error',
        message: err.response?.data?.message || 'Failed to reject appointment.'
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleOpenCompleteModal = (apt) => {
    setSelectedAppointment(apt);
    setConsultationNotes('');
    setCompleteModalOpen(true);
  };

  const handleConfirmComplete = async () => {
    if (!selectedAppointment) return;
    try {
      setActionLoading(true);
      await appointmentService.updateAppointmentStatus(
        selectedAppointment._id || selectedAppointment.id,
        'completed',
        consultationNotes || 'Consultation completed successfully'
      );
      setNotification({ type: 'success', message: 'Appointment marked as completed and consultation notes recorded.' });
      setCompleteModalOpen(false);
      setSelectedAppointment(null);
      await fetchAppointments();
    } catch (err) {
      console.error('Failed to complete appointment:', err);
      setNotification({
        type: 'error',
        message: err.response?.data?.message || 'Failed to update consultation.'
      });
    } finally {
      setActionLoading(false);
    }
  };

  const filtered = appointments.filter((apt) => {
    const st = (apt.status || '').toLowerCase();
    const matchesFilter = filter === 'all' || st === filter.toLowerCase();
    const patientName = apt.patient?.name || apt.patientName || '';
    const phone = apt.patient?.phone || apt.patientPhone || '';
    const service = apt.requestedService || apt.department || '';
    const token = String(apt.tokenNumber || '');
    const matchesSearch =
      patientName.toLowerCase().includes(search.toLowerCase()) ||
      phone.includes(search) ||
      service.toLowerCase().includes(search.toLowerCase()) ||
      token.includes(search);
    return matchesFilter && matchesSearch;
  });

  return (
    <div>
      <DashboardHeader
        title="Manage Facility Appointments"
        subtitle="Manage the daily OPD consultation queue, verify arrival, and log triage determinations."
      />

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

      {/* Filter and Search Bar */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem',
        marginBottom: '1.5rem'
      }}>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {[
            { label: 'Pending Review', value: 'pending' },
            { label: 'Accepted Queue', value: 'accepted' },
            { label: 'Completed', value: 'completed' },
            { label: 'All Requests', value: 'all' }
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

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', minWidth: '240px' }}>
          <input
            type="text"
            placeholder="Search by patient, phone, service..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="form-input"
            style={{ fontSize: '0.85rem', padding: '0.45rem 0.75rem' }}
          />
        </div>
      </div>

      {loading ? (
        <Loader message="Loading facility appointments..." />
      ) : filtered.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem 1.5rem' }}>
          <Calendar size={48} color="var(--color-text-muted)" style={{ margin: '0 auto 1rem' }} />
          <h3 style={{ fontSize: '1.15rem', color: 'var(--color-primary)', marginBottom: '0.5rem' }}>
            No Matching Appointments
          </h3>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>
            No patient appointments found under the selected filter criteria.
          </p>
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table className="table" style={{ width: '100%', fontSize: '0.875rem' }}>
            <thead>
              <tr>
                <th>Token</th>
                <th>Patient Details</th>
                <th>Requested Service</th>
                <th>Date & Slot</th>
                <th>Reported Symptoms</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((apt) => {
                const st = (apt.status || '').toLowerCase();
                const aptId = apt._id || apt.id;

                return (
                  <tr key={aptId}>
                    <td>
                      <span className="badge badge-routine" style={{ fontWeight: 700 }}>
                        #{apt.tokenNumber || 1}
                      </span>
                    </td>
                    <td>
                      <strong>{apt.patient?.name || apt.patientName || 'Citizen'}</strong>
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                        {apt.patient?.phone || apt.patientPhone || 'No contact'}
                      </div>
                    </td>
                    <td>{apt.requestedService || apt.department}</td>
                    <td>
                      <div>{(apt.preferredDate || apt.appointmentDate)?.slice(0, 10)}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                        {apt.preferredTime || apt.timeSlot}
                      </div>
                    </td>
                    <td style={{ maxWidth: '200px' }}>
                      <span style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>
                        {apt.notes || apt.symptoms || 'None specified'}
                      </span>
                      {apt.decisionReason && (
                        <div style={{ fontSize: '0.75rem', color: 'var(--color-emergency)', marginTop: '0.2rem' }}>
                          Reason: {apt.decisionReason}
                        </div>
                      )}
                    </td>
                    <td>
                      <StatusBadge status={apt.status} />
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '0.4rem', justifyContent: 'flex-end' }}>
                        {st === 'pending' && (
                          <>
                            <button
                              type="button"
                              className="btn btn-primary btn-sm"
                              style={{ fontSize: '0.78rem', padding: '0.3rem 0.6rem' }}
                              onClick={() => handleAccept(aptId)}
                              disabled={actionLoading}
                            >
                              <CheckCircle size={13} /> Accept
                            </button>
                            <button
                              type="button"
                              className="btn btn-outline btn-sm"
                              style={{ color: 'var(--color-emergency)', borderColor: 'var(--color-emergency)', fontSize: '0.78rem', padding: '0.3rem 0.6rem' }}
                              onClick={() => handleOpenRejectModal(apt)}
                              disabled={actionLoading}
                            >
                              <XCircle size={13} /> Reject
                            </button>
                          </>
                        )}

                        {st === 'accepted' && (
                          <button
                            type="button"
                            className="btn btn-secondary btn-sm"
                            style={{ fontSize: '0.78rem', padding: '0.3rem 0.6rem' }}
                            onClick={() => handleOpenCompleteModal(apt)}
                            disabled={actionLoading}
                          >
                            <CheckCircle size={13} /> Complete
                          </button>
                        )}

                        {st !== 'pending' && st !== 'accepted' && (
                          <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                            Closed
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Rejection Modal with Mandatory Decision Reason */}
      <Modal
        isOpen={rejectModalOpen}
        onClose={() => setRejectModalOpen(false)}
        title="Decline Consultation Request"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', margin: 0 }}>
            State healthcare protocols require a clear reason when declining an outpatient request so the patient or ASHA worker can reschedule appropriately.
          </p>

          <div className="form-group">
            <label className="form-label">Decision Reason *</label>
            <textarea
              rows={3}
              placeholder="e.g. Doctor is deployed on emergency duty; please choose afternoon slot or visit nearest CHC."
              value={decisionReason}
              onChange={(e) => setDecisionReason(e.target.value)}
              className="form-textarea"
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
            <Button
              variant="secondary"
              onClick={() => setRejectModalOpen(false)}
              disabled={actionLoading}
            >
              Cancel
            </Button>
            <Button
              variant="emergency"
              onClick={handleConfirmReject}
              disabled={actionLoading}
            >
              {actionLoading ? 'Recording...' : 'Confirm Rejection'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Complete Consultation Modal */}
      <Modal
        isOpen={completeModalOpen}
        onClose={() => setCompleteModalOpen(false)}
        title="Complete Patient Consultation"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', margin: 0 }}>
            Mark consultation as completed for patient <strong>{selectedAppointment?.patient?.name || selectedAppointment?.patientName || 'Citizen'}</strong>.
          </p>

          <div className="form-group">
            <label className="form-label">Clinical / Prescription Summary Notes (Optional)</label>
            <textarea
              rows={3}
              placeholder="e.g. Prescribed Paracetamol 500mg, advised hydration and 3 days rest."
              value={consultationNotes}
              onChange={(e) => setConsultationNotes(e.target.value)}
              className="form-textarea"
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
            <Button
              variant="secondary"
              onClick={() => setCompleteModalOpen(false)}
              disabled={actionLoading}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleConfirmComplete}
              disabled={actionLoading}
            >
              {actionLoading ? 'Saving...' : 'Finalize Consultation'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ManageAppointments;