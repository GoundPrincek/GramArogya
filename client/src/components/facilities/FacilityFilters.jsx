import React from 'react';
import { useTranslation } from 'react-i18next';
import { MAHARASHTRA_DISTRICTS } from '../../utils/constants';
import { Filter, RotateCcw } from 'lucide-react';

export const FacilityFilters = ({
  selectedDistrict,
  onDistrictChange,
  selectedTier,
  onTierChange,
  selectedService,
  onServiceChange,
  sortBy,
  onSortChange,
  onReset,
  hasActiveFilters
}) => {
  const { t } = useTranslation();

  const servicesList = [
    'General OPD Consultation',
    'Maternal & Antenatal Checkup',
    'Infant & Child Immunization',
    'Emergency Triage',
    'General Surgery',
    'Digital X-Ray & Ultrasound',
    'Basic Laboratory Pathology'
  ];

  return (
    <div style={{
      backgroundColor: '#ffffff',
      border: '1px solid var(--color-border)',
      borderRadius: 'var(--radius-lg)',
      padding: '1.25rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
      boxShadow: 'var(--shadow-sm)'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 600, color: 'var(--color-primary)' }}>
          <Filter size={18} />
          <span>Filters & Sort</span>
        </div>

        {hasActiveFilters && (
          <button
            onClick={onReset}
            className="btn btn-secondary btn-sm"
            style={{ fontSize: '0.8rem' }}
          >
            <RotateCcw size={13} /> {t('common.reset')}
          </button>
        )}
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '0.75rem'
      }}>
        {/* District Filter */}
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label" style={{ fontSize: '0.8rem' }}>{t('facilities.filterDistrict')}</label>
          <select
            value={selectedDistrict}
            onChange={(e) => onDistrictChange(e.target.value)}
            className="form-select"
            style={{ fontSize: '0.85rem', padding: '0.45rem 0.65rem' }}
          >
            <option value="">{t('facilities.allDistricts')}</option>
            {MAHARASHTRA_DISTRICTS.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>

        {/* Tier Filter */}
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label" style={{ fontSize: '0.8rem' }}>{t('facilities.filterTier')}</label>
          <select
            value={selectedTier}
            onChange={(e) => onTierChange(e.target.value)}
            className="form-select"
            style={{ fontSize: '0.85rem', padding: '0.45rem 0.65rem' }}
          >
            <option value="">{t('facilities.allTiers')}</option>
            <option value="SubCenter">Sub-Centre (ASHA / ANM)</option>
            <option value="PHC">Primary Health Centre (PHC)</option>
            <option value="CHC">Community Health Centre (CHC)</option>
            <option value="SubDistrictHospital">Sub-District Hospital</option>
            <option value="DistrictHospital">District Hospital (Tertiary)</option>
          </select>
        </div>

        {/* Service Filter */}
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label" style={{ fontSize: '0.8rem' }}>{t('facilities.filterService')}</label>
          <select
            value={selectedService}
            onChange={(e) => onServiceChange(e.target.value)}
            className="form-select"
            style={{ fontSize: '0.85rem', padding: '0.45rem 0.65rem' }}
          >
            <option value="">{t('facilities.allServices')}</option>
            {servicesList.map((srv, idx) => (
              <option key={idx} value={srv}>{srv}</option>
            ))}
          </select>
        </div>

        {/* Sort Control */}
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label" style={{ fontSize: '0.8rem' }}>{t('facilities.sortBy')}</label>
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="form-select"
            style={{ fontSize: '0.85rem', padding: '0.45rem 0.65rem' }}
          >
            <option value="name_asc">{t('facilities.sortNameAsc')}</option>
            <option value="name_desc">{t('facilities.sortNameDesc')}</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default FacilityFilters;
