import React, { useState, useEffect } from 'react';
import DashboardHeader from '../../components/dashboard/DashboardHeader';
import ReferralCard from '../../components/referrals/ReferralCard';
import referralService from '../../services/referralService';
import Loader from '../../components/common/Loader';
import { Share2, Info } from 'lucide-react';

export const MyReferrals = () => {
  const [referrals, setReferrals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  const fetchReferrals = async () => {
    try {
      setLoading(true);
      const res = await referralService.getMyReferrals();
      const list = Array.isArray(res?.data) ? res.data : (res?.data?.referrals || []);
      setReferrals(list);
    } catch (err) {
      console.error('Failed to load referrals:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReferrals();
  }, []);

  const filtered = referrals.filter((ref) => {
    if (filter === 'all') return true;
    const st = (ref.status || '').toLowerCase();
    if (filter === 'active') return st !== 'completed' && st !== 'rejected';
    if (filter === 'completed') return st === 'completed';
    return st === filter.toLowerCase();
  });

  return (
    <div>
      <DashboardHeader
        title="My Clinical Referrals"
        subtitle="Track inter-facility transfers and clinical care continuum initiated by medical officers."
      />

      <div className="notice-box-info" style={{ marginBottom: '1.5rem', fontSize: '0.875rem' }}>
        <Info size={18} style={{ flexShrink: 0 }} />
        <span>
          Clinical referrals are initiated by Primary Health Centre doctors when advanced diagnostic care, surgery, or specialist consultations are needed at higher-tier hospitals.
        </span>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        {[
          { label: 'All Transfers', value: 'all' },
          { label: 'Active Care', value: 'active' },
          { label: 'Completed', value: 'completed' }
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
        <Loader message="Loading clinical referral records..." />
      ) : filtered.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem 1.5rem' }}>
          <Share2 size={48} color="var(--color-text-muted)" style={{ margin: '0 auto 1rem' }} />
          <h3 style={{ fontSize: '1.15rem', color: 'var(--color-primary)', marginBottom: '0.5rem' }}>
            No Referrals Recorded
          </h3>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', maxWidth: '440px', margin: '0 auto' }}>
            {filter === 'all'
              ? 'No clinical referral records found for your account. Consultations at your local PHC may generate an inter-facility transfer if specialist care is required.'
              : `No referrals found matching the filter "${filter}".`}
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {filtered.map((ref) => (
            <ReferralCard key={ref._id || ref.id} referral={ref} />
          ))}
        </div>
      )}
    </div>
  );
};

export default MyReferrals;