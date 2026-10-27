import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { MapPin, Phone, Clock, ArrowRight, Map, ShieldCheck } from 'lucide-react';

export const FacilityCard = ({ facility, onSelectMap }) => {
  const { t } = useTranslation();
  const {
    _id,
    name,
    tier,
    facilityType,
    address,
    village,
    taluka,
    district,
    pincode,
    contact,
    contactInformation,
    operationalHours,
    operatingHours,
    servicesAvailable,
    services,
    location,
    coordinates
  } = facility;

  const resolvedTier = facilityType || tier;
  const resolvedContact = contactInformation || contact;
  const resolvedHours = operatingHours || operationalHours;
  const resolvedServices = services || servicesAvailable || [];

  const getTierBadge = (tTier) => {
    switch (tTier) {
      case 'DistrictHospital':
        return <span className="badge badge-emergency">District Hospital</span>;
      case 'SubDistrictHospital':
        return <span className="badge badge-warning">Sub-District Hospital</span>;
      case 'CHC':
        return <span className="badge badge-warning">CHC</span>;
      case 'PHC':
        return <span className="badge badge-accepted">PHC</span>;
      case 'SubCenter':
        return <span className="badge badge-routine">Sub-Centre</span>;
      default:
        return <span className="badge badge-info">{tTier || 'PHC'}</span>;
    }
  };

  const hasCoordinates = (location?.coordinates && location.coordinates.length === 2) || (coordinates && coordinates.length === 2);

  return (
    <div className="card card-interactive" style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem' }}>
        <div>
          <h3 style={{ fontSize: '1.15rem', color: 'var(--color-primary)', margin: 0, fontWeight: 700 }}>
            {name}
          </h3>
          <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
            Public Healthcare &bull; {taluka}, {district}
          </span>
        </div>
        {getTierBadge(resolvedTier)}
      </div>

      {/* Location & Address */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.4rem' }}>
          <MapPin size={16} color="var(--color-primary-light)" style={{ flexShrink: 0, marginTop: '2px' }} />
          <span>
            {village ? `${village}, ` : ''}{taluka}, {district} - {pincode}
          </span>
        </div>

        {resolvedContact?.phone && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Phone size={15} color="var(--color-primary-light)" style={{ flexShrink: 0 }} />
            <span>{resolvedContact.phone}</span>
          </div>
        )}

        {resolvedHours && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Clock size={15} color="var(--color-primary-light)" style={{ flexShrink: 0 }} />
            <span>
              {resolvedHours.is24x7Emergency
                ? '24x7 Emergency Services Available'
                : `${resolvedHours.opensAt || '09:00 AM'} - ${resolvedHours.closesAt || '05:00 PM'}`}
            </span>
          </div>
        )}
      </div>

      {/* Services Preview */}
      {resolvedServices && resolvedServices.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', margin: '0.25rem 0' }}>
          {resolvedServices.slice(0, 3).map((srv, idx) => (
            <span
              key={idx}
              style={{
                backgroundColor: 'var(--color-accent-subtle)',
                color: 'var(--color-primary)',
                fontSize: '0.75rem',
                padding: '0.2rem 0.5rem',
                borderRadius: 'var(--radius-sm)',
                fontWeight: 500
              }}
            >
              {srv}
            </span>
          ))}
          {resolvedServices.length > 3 && (
            <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', alignSelf: 'center' }}>
              +{resolvedServices.length - 3} more
            </span>
          )}
        </div>
      )}

      {/* Action Buttons */}
      <div style={{
        marginTop: 'auto',
        paddingTop: '0.85rem',
        borderTop: '1px solid var(--color-border)',
        display: 'flex',
        gap: '0.5rem'
      }}>
        <Link
          to={`/facilities/${_id}`}
          className="btn btn-primary"
          style={{ flex: 1, fontSize: '0.85rem', padding: '0.45rem 0.75rem' }}
        >
          {t('common.viewDetails')} <ArrowRight size={14} />
        </Link>

        {hasCoordinates && onSelectMap && (
          <button
            type="button"
            onClick={() => onSelectMap(facility)}
            className="btn btn-secondary"
            style={{ fontSize: '0.85rem', padding: '0.45rem 0.75rem' }}
            title={t('common.viewMap')}
          >
            <Map size={15} />
          </button>
        )}
      </div>
    </div>
  );
};

export default FacilityCard;
