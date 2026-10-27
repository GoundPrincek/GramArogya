import React from 'react';
import { Link } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { MapPin, ArrowRight } from 'lucide-react';

// Default Maharashtra Center (Pune / Ahmednagar region)
const DEFAULT_CENTER = [18.7, 74.2];

export const FacilityMap = ({ facilities = [], center = DEFAULT_CENTER, zoom = 8, height = '450px' }) => {
  return (
    <div style={{
      height,
      width: '100%',
      borderRadius: 'var(--radius-lg)',
      overflow: 'hidden',
      border: '1px solid var(--color-border)',
      boxShadow: 'var(--shadow-sm)'
    }}>
      <MapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom={false}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {facilities.map((fac) => {
          if (!fac.location?.coordinates || fac.location.coordinates.length < 2) {
            return null;
          }
          const [lng, lat] = fac.location.coordinates;

          return (
            <Marker key={fac._id || fac.facilityCode} position={[lat, lng]}>
              <Popup>
                <div style={{ fontSize: '0.875rem', padding: '0.2rem' }}>
                  <span className="badge badge-accepted" style={{ fontSize: '0.7rem', marginBottom: '0.3rem' }}>
                    {fac.tier}
                  </span>
                  <strong style={{ display: 'block', fontSize: '0.95rem', color: 'var(--color-primary)' }}>
                    {fac.name}
                  </strong>
                  <div style={{ color: 'var(--color-text-secondary)', margin: '0.25rem 0 0.5rem' }}>
                    {fac.taluka}, {fac.district} - {fac.pincode}
                  </div>
                  {fac.contact?.phone && (
                    <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                      📞 {fac.contact.phone}
                    </div>
                  )}
                  <div style={{ marginTop: '0.5rem' }}>
                    <Link
                      to={`/facilities/${fac._id}`}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.25rem',
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        color: 'var(--color-primary)'
                      }}
                    >
                      View Details & Book <ArrowRight size={12} />
                    </Link>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};

export default FacilityMap;
