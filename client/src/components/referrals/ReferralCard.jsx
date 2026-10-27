import React from 'react';
import ReferralStatus from './ReferralStatus';
import { formatDate } from '../../utils/formatDate';
import { ArrowRight, Hospital, FileText, AlertCircle } from 'lucide-react';

export const ReferralCard = ({ referral }) => {
  const { fromFacilityId, toFacilityId, urgencyLevel, status, provisionalDiagnosis, reasonForReferral, createdAt } = referral;

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
          {formatDate(createdAt)}
        </span>
        <ReferralStatus status={status} urgency={urgencyLevel} />
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
            {fromFacilityId?.name || 'Primary Health Center'}
          </span>
        </div>
        <ArrowRight size={18} color="var(--color-text-muted)" />
        <div style={{ flex: 1 }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', display: 'block' }}>TO</span>
          <span style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--color-primary)' }}>
            {toFacilityId?.name || 'District Referral Hospital'}
          </span>
        </div>
      </div>

      <div style={{ fontSize: '0.9rem' }}>
        <div><strong>Provisional Diagnosis:</strong> {provisionalDiagnosis}</div>
        <div style={{ color: 'var(--color-text-secondary)', marginTop: '0.2rem' }}>
          <strong>Clinical Reason:</strong> {reasonForReferral}
        </div>
      </div>
    </div>
  );
};

export default ReferralCard;
