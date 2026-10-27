import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Clock, ArrowRight } from 'lucide-react';

export const FacilityCard = ({ facility }) => {
  const { _id, name, tier, address, contact, operationalHours } = facility;

  const getTierBadge = (t) => {
    switch (t) {
      case 'DistrictHospital':
        return <span className="badge badge-emergency">District Hospital</span>;
      case 'CHC':
        return <span className="badge badge-warning">CHC</span>;
      case 'PHC':
        return <span className="badge badge-success">PHC</span>;
      default:
        return <span className="badge badge-info">{t}</span>;
    }
  };

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem' }}>
        <h3 style={{ fontSize: '1.15rem', color: 'var(--color-primary)', margin: 0 }}>
          {name}
        </h3>
        {getTierBadge(tier)}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <MapPin size={16} color="var(--color-primary-light)" />
          <span>
            {address?.village ? `${address.village}, ` : ''}
            {address?.taluka}, {address?.district} - {address?.pincode}
          </span>
        </div>

        {contact?.phone && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Phone size={16} color="var(--color-primary-light)" />
            <span>{contact.phone}</span>
          </div>
        )}

        {operationalHours && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Clock size={16} color="var(--color-primary-light)" />
            <span>
              {operationalHours.is24x7Emergency
                ? '24x7 Emergency Services'
                : `${operationalHours.opensAt || '09:00'} - ${operationalHours.closesAt || '17:00'}`}
            </span>
          </div>
        )}
      </div>

      <div style={{ marginTop: 'auto', paddingTop: '0.75rem', borderTop: '1px solid var(--color-border)' }}>
        <Link
          to={`/facilities/${_id}`}
          className="btn btn-outline"
          style={{ width: '100%', fontSize: '0.85rem', padding: '0.4rem' }}
        >
          View Facility & Doctors <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
};

export default FacilityCard;
