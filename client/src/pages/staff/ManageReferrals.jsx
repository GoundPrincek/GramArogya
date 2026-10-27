import React, { useState, useEffect } from 'react';
import DashboardHeader from '../../components/dashboard/DashboardHeader';
import StatusBadge from '../../components/common/StatusBadge';
import Loader from '../../components/common/Loader';
import Modal from '../../components/common/Modal';
import Button from '../../components/common/Button';
import referralService from '../../services/referralService';
import facilityService from '../../services/facilityService';
import { useAuth } from '../../hooks/useAuth';
import { formatDate } from '../../utils/formatDate';
import {
  Share2,
  PlusCircle,
  CheckCircle,
  AlertCircle,
  Clock,
  ArrowRight,
  Filter,
  FileText
} from 'lucide-react';

export const ManageReferrals = () => {
  const { user } = useAuth();
  const [referrals, setReferrals] = useState([]);
  const [facilities, setFacilities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, incoming, outgoing, active
  const [notification, setNotification] = useState(null);

  // Triage update modal
  const [triageModalOpen, setTriageModalOpen] = useState(false);
  const [selectedReferral, setSelectedReferral] = useState(null);
  const [targetStatus, setTargetStatus] = useState('');
  const [triageNote, setTriageNote] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  // Create new referral modal
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    patientId: '',
    receivingFacilityId: '',
    provisionalDiagnosis: '',
    referralReason: '',
    urgencyLevel: 'Routine',
    bloodPressure: '120/80',
    pulse: 76,
    spo2: '98',
    temp: '98.6 F'
  });

  const currentFacilityId = user?.facilityId?._id || user?.facilityId;

  const loadData = async () => {
    try {
      setLoading(true);
      const [refRes, facRes] = await Promise.allSettled([
        referralService.getFacilityReferrals(currentFacilityId),
        facilityService.getFacilities()
      ]);

      if (refRes.status === 'fulfilled') {
        const list = Array.isArray(refRes.value?.data)
          ? refRes.value.data
          : (refRes.value?.data?.referrals || []);
        setReferrals(list);
      }

      if (facRes.status === 'fulfilled') {
        const facList = Array.isArray(facRes.value?.data)
          ? facRes.value.data
          : (facRes.value?.data?.facilities || []);
        setFacilities(facList);
      }
    } catch (err) {
      console.error('Failed to load referrals:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [user]);

  const handleOpenTriage = (ref, nextStatus) => {
    setSelectedReferral(ref);
    setTargetStatus(nextStatus);
    setTriageNote('');
    setTriageModalOpen(true);
  };

  const handleConfirmTriage = async () => {
    if (!selectedReferral || !targetStatus) return;
    try {
      setActionLoading(true);
      await referralService.triageReferral(
        selectedReferral._id || selectedReferral.id,
        targetStatus,
        triageNote || `Status updated to ${targetStatus} by ${user?.name || 'Medical Officer'}`
      );
      setNotification({
        type: 'success',
        message: `Referral case ${selectedReferral.referralCode || ''} transitioned to ${targetStatus}.`
      });
      setTriageModalOpen(false);
      setSelectedReferral(null);
      await loadData();
    } catch (err) {
      console.error('Failed to transition referral:', err);
      setNotification({
        type: 'error',
        message: err.response?.data?.message || 'Failed to update referral status.'
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleCreateReferral = async (e) => {
    e.preventDefault();
    if (!formData.receivingFacilityId || !formData.referralReason) {
      alert('Please select a destination facility and provide a referral reason.');
      return;
    }

    try {
      setActionLoading(true);
      const payload = {
        patient: formData.patientId || user?._id || user?.id,
        referringFacility: currentFacilityId || facilities[0]?._id,
        receivingFacility: formData.receivingFacilityId,
        referralReason: formData.referralReason,
        provisionalDiagnosis: formData.provisionalDiagnosis,
        urgencyLevel: formData.urgencyLevel,
        vitals: {
          bloodPressure: formData.bloodPressure,
          pulse: Number(formData.pulse) || 72,
          spo2: formData.spo2,
          temp: formData.temp
        }
      };

      await referralService.createReferral(payload);
      setNotification({ type: 'success', message: 'Clinical referral created successfully and queued for dispatch.' });
      setCreateModalOpen(false);
      setFormData({
        patientId: '',
        receivingFacilityId: '',
        provisionalDiagnosis: '',
        referralReason: '',
        urgencyLevel: 'Routine',
        bloodPressure: '120/80',
        pulse: 76,
        spo2: '98',
        temp: '98.6 F'
      });
      await loadData();
    } catch (err) {
      console.error('Failed to create referral:', err);
      setNotification({
        type: 'error',
        message: err.response?.data?.message || 'Failed to create clinical referral.'
      });
    } finally {
      setActionLoading(false);
    }
  };

  const filtered = referrals.filter((ref) => {
    const fromId = ref.referringFacility?._id || ref.referringFacility || ref.fromFacilityId;
    const toId = ref.receivingFacility?._id || ref.receivingFacility || ref.toFacilityId;
    const st = (ref.status || '').toLowerCase();

    if (filter === 'incoming') return String(toId) === String(currentFacilityId);
    if (filter === 'outgoing') return String(fromId) === String(currentFacilityId);
    if (filter === 'active') return st !== 'completed' && st !== 'rejected';
    return true;
  });

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
        <DashboardHeader
          title="Inter-Facility Referral Triage"
          subtitle="Manage patient continuum of care transfers, emergency escalations, and facility handoffs."
        />
        <Button variant="primary" onClick={() => setCreateModalOpen(true)}>
          <PlusCircle size={16} /> Initiate Clinical Referral
        </Button>
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
          { label: 'All Transfers', value: 'all' },
          { label: 'Active Care', value: 'active' },
          { label: 'Incoming to My Facility', value: 'incoming' },
          { label: 'Outgoing Referrals', value: 'outgoing' }
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
        <Loader message="Loading clinical referral triage..." />
      ) : filtered.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem 1.5rem' }}>
          <Share2 size={48} color="var(--color-text-muted)" style={{ margin: '0 auto 1rem' }} />
          <h3 style={{ fontSize: '1.15rem', color: 'var(--color-primary)', marginBottom: '0.5rem' }}>
            No Clinical Referrals Found
          </h3>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
            No patient referrals found under this filter. Click &ldquo;Initiate Clinical Referral&rdquo; to create a new inter-facility handoff.
          </p>
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table className="table" style={{ width: '100%', fontSize: '0.875rem' }}>
            <thead>
              <tr>
                <th>Code & Urgency</th>
                <th>Transfer Route</th>
                <th>Diagnosis & Clinical Reason</th>
                <th>Vitals</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Triage Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((ref) => {
                const st = (ref.status || 'created').toLowerCase();
                const fromName = ref.referringFacility?.name || ref.fromFacilityId?.name || ref.referringFacilityName || 'Origin PHC';
                const toName = ref.receivingFacility?.name || ref.toFacilityId?.name || ref.receivingFacilityName || 'Destination Hospital';

                return (
                  <tr key={ref._id || ref.id}>
                    <td>
                      <strong>{ref.referralCode || `REF-${(ref._id || '').slice(-6).toUpperCase()}`}</strong>
                      <div style={{ marginTop: '0.2rem' }}>
                        <span className={`badge ${ref.urgencyLevel === 'Emergency' ? 'badge-emergency' : ref.urgencyLevel === 'Urgent' ? 'badge-warning' : 'badge-routine'}`}>
                          {ref.urgencyLevel || 'Routine'}
                        </span>
                      </div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600, color: 'var(--color-primary)' }}>{fromName}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>&darr; to</div>
                      <div style={{ fontWeight: 600, color: 'var(--color-secondary)' }}>{toName}</div>
                    </td>
                    <td style={{ maxWidth: '240px' }}>
                      <strong>{ref.provisionalDiagnosis || 'General OPD assessment'}</strong>
                      <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', marginTop: '0.2rem' }}>
                        {ref.referralReason || ref.reasonForReferral}
                      </div>
                    </td>
                    <td>
                      {ref.vitals ? (
                        <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                          <div>BP: {ref.vitals.bloodPressure || 'N/A'}</div>
                          <div>Pulse: {ref.vitals.pulse ? `${ref.vitals.pulse} bpm` : 'N/A'}</div>
                          <div>SpO2: {ref.vitals.spo2 ? `${ref.vitals.spo2}%` : 'N/A'}</div>
                        </div>
                      ) : (
                        <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>--</span>
                      )}
                    </td>
                    <td>
                      <StatusBadge status={ref.status} urgency={ref.urgencyLevel} />
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '0.35rem', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                        {st === 'created' && (
                          <button
                            type="button"
                            className="btn btn-outline btn-sm"
                            style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}
                            onClick={() => handleOpenTriage(ref, 'sent')}
                            disabled={actionLoading}
                          >
                            Mark Sent
                          </button>
                        )}

                        {st === 'sent' && (
                          <>
                            <button
                              type="button"
                              className="btn btn-primary btn-sm"
                              style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}
                              onClick={() => handleOpenTriage(ref, 'accepted')}
                              disabled={actionLoading}
                            >
                              Accept Transfer
                            </button>
                            <button
                              type="button"
                              className="btn btn-outline btn-sm"
                              style={{ color: 'var(--color-emergency)', borderColor: 'var(--color-emergency)', fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}
                              onClick={() => handleOpenTriage(ref, 'rejected')}
                              disabled={actionLoading}
                            >
                              Decline
                            </button>
                          </>
                        )}

                        {st === 'accepted' && (
                          <button
                            type="button"
                            className="btn btn-secondary btn-sm"
                            style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}
                            onClick={() => handleOpenTriage(ref, 'in_progress')}
                            disabled={actionLoading}
                          >
                            Start Care
                          </button>
                        )}

                        {st === 'in_progress' && (
                          <button
                            type="button"
                            className="btn btn-primary btn-sm"
                            style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}
                            onClick={() => handleOpenTriage(ref, 'completed')}
                            disabled={actionLoading}
                          >
                            Complete Transfer
                          </button>
                        )}

                        {(st === 'completed' || st === 'rejected') && (
                          <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
                            Case Closed
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

      {/* Triage Status Update Modal */}
      <Modal
        isOpen={triageModalOpen}
        onClose={() => setTriageModalOpen(false)}
        title={`Update Referral State: ${targetStatus?.toUpperCase()}`}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', margin: 0 }}>
            Transition case <strong>{selectedReferral?.referralCode}</strong> to <strong>{targetStatus}</strong>.
          </p>

          <div className="form-group">
            <label className="form-label">Triage & Bed Coordination Note</label>
            <textarea
              rows={3}
              placeholder="e.g. Bed #4 in Pediatric Ward reserved; ambulance dispatched."
              value={triageNote}
              onChange={(e) => setTriageNote(e.target.value)}
              className="form-textarea"
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
            <Button
              variant="secondary"
              onClick={() => setTriageModalOpen(false)}
              disabled={actionLoading}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleConfirmTriage}
              disabled={actionLoading}
            >
              {actionLoading ? 'Updating...' : `Confirm ${targetStatus}`}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Create Referral Modal */}
      <Modal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title="Initiate Clinical Referral Transfer"
      >
        <form onSubmit={handleCreateReferral} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="form-group">
            <label className="form-label">Destination Receiving Facility *</label>
            <select
              className="form-select"
              value={formData.receivingFacilityId}
              onChange={(e) => setFormData({ ...formData, receivingFacilityId: e.target.value })}
              required
            >
              <option value="">-- Select Receiving Hospital --</option>
              {facilities.map((f) => (
                <option key={f._id} value={f._id}>
                  {f.name} ({f.facilityType || f.tier}) &bull; {f.district}
                </option>
              ))}
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem' }}>
            <div className="form-group">
              <label className="form-label">Urgency Level *</label>
              <select
                className="form-select"
                value={formData.urgencyLevel}
                onChange={(e) => setFormData({ ...formData, urgencyLevel: e.target.value })}
              >
                <option value="Routine">Routine</option>
                <option value="Urgent">Urgent</option>
                <option value="Emergency">Emergency</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Provisional Diagnosis</label>
              <input
                type="text"
                placeholder="e.g. Acute severe asthma"
                value={formData.provisionalDiagnosis}
                onChange={(e) => setFormData({ ...formData, provisionalDiagnosis: e.target.value })}
                className="form-input"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Clinical Referral Reason *</label>
            <textarea
              rows={2}
              placeholder="e.g. Requires pediatric ICU bed and arterial blood gas monitoring."
              value={formData.referralReason}
              onChange={(e) => setFormData({ ...formData, referralReason: e.target.value })}
              className="form-textarea"
              required
            />
          </div>

          {/* Vitals Row */}
          <div>
            <label className="form-label" style={{ marginBottom: '0.35rem', display: 'block' }}>Patient Vitals at Handoff</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))', gap: '0.5rem' }}>
              <input
                type="text"
                placeholder="BP (120/80)"
                value={formData.bloodPressure}
                onChange={(e) => setFormData({ ...formData, bloodPressure: e.target.value })}
                className="form-input"
                style={{ fontSize: '0.8rem' }}
              />
              <input
                type="number"
                placeholder="Pulse (bpm)"
                value={formData.pulse}
                onChange={(e) => setFormData({ ...formData, pulse: e.target.value })}
                className="form-input"
                style={{ fontSize: '0.8rem' }}
              />
              <input
                type="text"
                placeholder="SpO2 (%)"
                value={formData.spo2}
                onChange={(e) => setFormData({ ...formData, spo2: e.target.value })}
                className="form-input"
                style={{ fontSize: '0.8rem' }}
              />
              <input
                type="text"
                placeholder="Temp (F)"
                value={formData.temp}
                onChange={(e) => setFormData({ ...formData, temp: e.target.value })}
                className="form-input"
                style={{ fontSize: '0.8rem' }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
            <Button
              variant="secondary"
              type="button"
              onClick={() => setCreateModalOpen(false)}
              disabled={actionLoading}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              type="submit"
              disabled={actionLoading}
            >
              {actionLoading ? 'Initiating...' : 'Submit Referral Transfer'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ManageReferrals;