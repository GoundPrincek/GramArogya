import React, { useState } from 'react';
import ReferralStatus from './ReferralStatus';
import { formatDate } from '../../utils/formatDate';
import { ArrowRight, Hospital, FileText, AlertCircle, ChevronDown, ChevronUp, Clock } from 'lucide-react';

export const ReferralCard = ({ referral }) => {
  const [showTimeline, setShowTimeline] = useState(false);

  const fromName =
    referral.referringFacility?.name ||
    referral.fromFacilityId?.name ||
    referral.referringFacilityName ||
    'Primary Health Center';

  const toName =
    referral.receivingFacility?.name ||
    referral.toFacilityId?.name ||
    referral.receivingFacilityName ||
    'District Referral Hospital';

  const reason = referral.referralReason || referral.reasonForReferral || 'Clinical transfer';
  const diagnosis = referral.provisionalDiagnosis || 'General OPD assessment';
  const referralCode = referral.referralCode || `REF-${(referral._id || '').slice(-6).toUpperCase()}`;
  const history = referral.statusHistory || [];

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-primary)' }}>
            {referralCode}
          </span>
          <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
            &bull; {formatDate(referral.createdAt)}
          </span>
        </div>
        <ReferralStatus status={referral.status} urgency={referral.urgencyLevel} />
      </div>

      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        padding: '0.75rem',
        backgroundColor: 'var(--color-bg-main)',
        borderRadius: 'var(--radius-md)'
      }}>
        <div style={{ flex: 1 }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', display: 'block' }}>FROM</span>
          <span style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--color-primary)' }}>
            {fromName}
          </span>
        </div>
        <ArrowRight size={18} color="var(--color-text-muted)" />
        <div style={{ flex: 1 }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', display: 'block' }}>TO</span>
          <span style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--color-primary)' }}>
            {toName}
          </span>
        </div>
      </div>

      <div style={{ fontSize: '0.9rem' }}>
        <div><strong>Provisional Diagnosis:</strong> {diagnosis}</div>
        <div style={{ color: 'var(--color-text-secondary)', marginTop: '0.2rem' }}>
          <strong>Clinical Reason:</strong> {reason}
        </div>
      </div>

      {referral.vitals && (
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '1rem',
          backgroundColor: 'var(--color-bg-main)',
          padding: '0.45rem 0.75rem',
          borderRadius: 'var(--radius-sm)',
          fontSize: '0.8rem',
          color: 'var(--color-text-secondary)'
        }}>
          {referral.vitals.bloodPressure && <span>BP: <strong>{referral.vitals.bloodPressure}</strong></span>}
          {referral.vitals.pulse && <span>Pulse: <strong>{referral.vitals.pulse} bpm</strong></span>}
          {referral.vitals.spo2 && <span>SpO2: <strong>{referral.vitals.spo2}%</strong></span>}
          {referral.vitals.temp && <span>Temp: <strong>{referral.vitals.temp}</strong></span>}
        </div>
      )}

      {history.length > 0 && (
        <div style={{ marginTop: '0.25rem', borderTop: '1px solid var(--color-border)', paddingTop: '0.5rem' }}>
          <button
            type="button"
            onClick={() => setShowTimeline(!showTimeline)}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--color-secondary)',
              fontSize: '0.8rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.3rem',
              padding: 0
            }}
          >
            <Clock size={13} /> {showTimeline ? 'Hide Status History' : `View Status History (${history.length})`}
            {showTimeline ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>

          {showTimeline && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.65rem', paddingLeft: '0.5rem', borderLeft: '2px solid var(--color-border)' }}>
              {history.map((h, idx) => (
                <div key={idx} style={{ fontSize: '0.8rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-text-muted)' }}>
                    <strong style={{ color: 'var(--color-primary)', textTransform: 'capitalize' }}>
                      {h.status?.replace('_', ' ')}
                    </strong>
                    <span>{formatDate(h.timestamp)}</span>
                  </div>
                  {h.actor && <div style={{ color: 'var(--color-text-secondary)', fontSize: '0.75rem' }}>By: {h.actor}</div>}
                  {h.note && <div style={{ color: 'var(--color-text-primary)', marginTop: '0.15rem' }}>{h.note}</div>}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ReferralCard;
