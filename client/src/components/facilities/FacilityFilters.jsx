import React from 'react';
import { MAHARASHTRA_DISTRICTS } from '../../utils/constants';

export const FacilityFilters = ({ selectedDistrict, onDistrictChange, selectedTier, onTierChange, onReset }) => {
  return (
    <div style={{
      display: 'flex',
      flexWrap: 'wrap',
      gap: '0.75rem',
      alignItems: 'center',
      padding: '0.75rem',
      backgroundColor: '#ffffff',
      border: '1px solid var(--color-border)',
      borderRadius: 'var(--radius-md)'
    }}>
      {/* District Filter */}
      <div style={{ flex: '1 1 180px' }}>
        <select
          value={selectedDistrict}
          onChange={(e) => onDistrictChange(e.target.value)}
          className="form-select"
          style={{ fontSize: '0.9rem', padding: '0.45rem' }}
        >
          <option value="">All Maharashtra Districts</option>
          {MAHARASHTRA_DISTRICTS.map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>
      </div>

      {/* Tier Filter */}
      <div style={{ flex: '1 1 180px' }}>
        <select
          value={selectedTier}
          onChange={(e) => onTierChange(e.target.value)}
          className="form-select"
          style={{ fontSize: '0.9rem', padding: '0.45rem' }}
        >
          <option value="">All Tiers (PHC, CHC, etc.)</option>
          <option value="SubCenter">Sub-Centre</option>
          <option value="PHC">Primary Health Centre (PHC)</option>
          <option value="CHC">Community Health Centre (CHC)</option>
          <option value="DistrictHospital">District Hospital</option>
        </select>
      </div>

      {(selectedDistrict || selectedTier) && (
        <button
          onClick={onReset}
          className="btn btn-secondary"
          style={{ padding: '0.45rem 0.8rem', fontSize: '0.85rem' }}
        >
          Reset Filters
        </button>
      )}
    </div>
  );
};

export default FacilityFilters;
