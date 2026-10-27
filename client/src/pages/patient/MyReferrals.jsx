import React from 'react';
import DashboardHeader from '../../components/dashboard/DashboardHeader';
import ReferralCard from '../../components/referrals/ReferralCard';

export const MyReferrals = () => {
  // Sample placeholder referral for Phase 1 skeleton
  const sampleReferral = {
    _id: 'ref-001',
    createdAt: new Date().toISOString(),
    status: 'Accepted',
    urgencyLevel: 'Urgent',
    fromFacilityId: { name: 'Wagholi PHC', tier: 'PHC' },
    toFacilityId: { name: 'Aundh District Hospital', tier: 'DistrictHospital' },
    provisionalDiagnosis: 'Severe Acute Bronchitis',
    reasonForReferral: 'Requires pediatric pulmonology consultation and oxygen saturation monitoring.'
  };

  return (
    <div>
      <DashboardHeader
        title="My Clinical Referrals"
        subtitle="Track inter-facility transfers initiated by medical officers."
      />

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <ReferralCard referral={sampleReferral} />
      </div>
    </div>
  );
};

export default MyReferrals;
